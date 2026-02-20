import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { sendProposalEmail } from "@/lib/email";

// GET - List all proposals
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: proposals, error } = await supabase
      .from("proposals")
      .select("*, clients(name, company, email)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ proposals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Save a new proposal
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      content,
      clientName,
      clientCompany,
      clientEmail,
      currency,
      language,
      status,
    } = body;

    // Create or find client
    let clientId = null;
    if (clientName) {
      // Check if client exists
      const { data: existingClient } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .eq("name", clientName)
        .single();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient, error: clientError } = await supabase
          .from("clients")
          .insert({
            user_id: user.id,
            name: clientName,
            company: clientCompany || null,
            email: clientEmail || null,
          })
          .select("id")
          .single();

        if (clientError) throw clientError;
        clientId = newClient.id;
      }
    }

    // Calculate total from standard package
    const totalAmount = content?.packages?.[1]?.price || content?.packages?.[0]?.price || 0;

    // Generate unique slug
    const slug = crypto.randomUUID().split("-")[0] + "-" + (title || "proposal").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);

    // Save proposal
    const { data: proposal, error } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        client_id: clientId,
        title: title || content?.title || "Untitled Proposal",
        slug: slug,
        content: content,
        status: status || "draft",
        total_amount: totalAmount,
        currency: currency || "USD",
        language: language || "English",
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;

    // If status is "sent" and client has email, send email
    let emailSent = false;
    if (status === "sent" && clientEmail) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, business_name")
          .eq("id", user.id)
          .single();

        const freelancerName = profile?.business_name || profile?.full_name || "A freelancer";
        const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://proposalai.app";
        const proposalUrl = `${APP_URL}/p/${slug}`;

        await sendProposalEmail({
          to: clientEmail,
          clientName: clientName || "Client",
          proposalTitle: title || content?.title || "Project Proposal",
          freelancerName,
          proposalUrl,
          totalAmount,
          currency,
        });
        emailSent = true;
        console.log(`[Email] Proposal sent to ${clientEmail}`);
      } catch (emailError: any) {
        console.error("[Email] Send failed:", emailError.message);
      }
    }

    return NextResponse.json({ success: true, proposal, emailSent });
  } catch (error: any) {
    console.error("Save proposal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
