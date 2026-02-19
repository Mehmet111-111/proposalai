import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch original proposal
    const { data: original, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !original) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Generate new slug
    const slug = crypto.randomUUID().split("-")[0] + "-" + (original.title || "proposal").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);

    // Create duplicate
    const { data: duplicate, error } = await supabase
      .from("proposals")
      .insert({
        user_id: user.id,
        client_id: original.client_id,
        title: `${original.title} (Copy)`,
        slug,
        content: original.content,
        status: "draft",
        total_amount: original.total_amount,
        currency: original.currency,
        language: original.language,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, proposal: duplicate });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
