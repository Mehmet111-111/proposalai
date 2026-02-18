import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check subscription limits
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, proposals_this_month")
      .eq("id", user.id)
      .single();

    const limits: Record<string, number> = {
      free: 3,
      starter: 20,
      pro: 999,
      agency: 999,
    };

    const plan = profile?.subscription_plan || "free";
    const used = profile?.proposals_this_month || 0;
    const limit = limits[plan] || 3;

    if (used >= limit) {
      return NextResponse.json(
        {
          error: "Monthly proposal limit reached",
          limit,
          used,
          plan,
        },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      projectType,
      projectDescription,
      clientName,
      clientCompany,
      currency,
      language,
    } = body;

    if (!projectType || !projectDescription) {
      return NextResponse.json(
        { error: "Project type and description are required" },
        { status: 400 }
      );
    }

    // Generate proposal with Claude
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are an expert proposal writer for freelancers. Generate a professional project proposal in JSON format.

PROJECT DETAILS:
- Type: ${projectType}
- Description: ${projectDescription}
- Client Name: ${clientName || "Client"}
- Client Company: ${clientCompany || ""}
- Currency: ${currency || "USD"}
- Language: ${language || "English"}

Generate a proposal with this EXACT JSON structure (no markdown, just pure JSON):
{
  "title": "proposal title",
  "summary": "2-3 sentence executive summary",
  "scope": [
    {
      "title": "scope item title",
      "description": "detailed description"
    }
  ],
  "timeline": [
    {
      "phase": "Phase 1: ...",
      "duration": "X weeks",
      "deliverables": ["deliverable 1", "deliverable 2"]
    }
  ],
  "packages": [
    {
      "name": "Basic",
      "price": 0,
      "description": "package description",
      "features": ["feature 1", "feature 2", "feature 3"]
    },
    {
      "name": "Standard",
      "price": 0,
      "description": "package description",
      "features": ["feature 1", "feature 2", "feature 3", "feature 4"]
    },
    {
      "name": "Premium",
      "price": 0,
      "description": "package description",
      "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"]
    }
  ],
  "terms": "payment terms and conditions text",
  "validUntil": "30 days from today"
}

IMPORTANT RULES:
- Set realistic market prices for the project type
- Include 3-5 scope items
- Include 2-4 timeline phases
- Always provide 3 packages (Basic, Standard, Premium)
- Premium should be 2-3x the Basic price
- Write in ${language || "English"}
- Use ${currency || "USD"} for all prices
- Be specific and professional
- Return ONLY valid JSON, no extra text`,
        },
      ],
    });

    // Parse Claude's response
    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let proposalContent;
    try {
      // Try to parse directly
      proposalContent = JSON.parse(responseText);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        proposalContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    // Increment proposals_this_month
    await supabase
      .from("profiles")
      .update({ proposals_this_month: used + 1 })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      proposal: proposalContent,
      usage: {
        used: used + 1,
        limit,
        plan,
      },
    });
  } catch (error: any) {
    console.error("Proposal generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate proposal" },
      { status: 500 }
    );
  }
}
