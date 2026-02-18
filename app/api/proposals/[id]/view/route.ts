import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Use service role to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: proposal } = await supabase
      .from("proposals")
      .select("*, clients(name)")
      .eq("id", id)
      .single();

    if (!proposal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Mark as viewed ONLY if status is exactly "sent"
    if (proposal.status === "sent") {
      await supabase
        .from("proposals")
        .update({ status: "viewed", viewed_at: new Date().toISOString() })
        .eq("id", id);

      await supabase.from("notifications").insert({
        user_id: proposal.user_id,
        type: "proposal_viewed",
        title: "Proposal Viewed",
        message: `${proposal.clients?.name || "Client"} viewed "${proposal.title}"`,
        link: `/dashboard/proposals/${proposal.id}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
