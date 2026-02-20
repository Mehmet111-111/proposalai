import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { sendProposalEmail } from "@/lib/email";

const APP_URL = "https://proposalai.app";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Get proposal with client info
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*, clients(name, email, company)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Get freelancer profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name")
      .eq("id", user.id)
      .single();

    const freelancerName = profile?.business_name || profile?.full_name || "A freelancer";
    const clientEmail = proposal.clients?.email;
    const clientName = proposal.clients?.name || "Client";
    const proposalUrl = `${APP_URL}/p/${proposal.slug || proposal.public_url}`;

    // Update status to sent
    await supabase
      .from("proposals")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);

    // Send email if client has email
    let emailSent = false;
    if (clientEmail) {
      try {
        await sendProposalEmail({
          to: clientEmail,
          clientName,
          proposalTitle: proposal.title,
          freelancerName,
          proposalUrl,
          totalAmount: proposal.total_amount,
          currency: proposal.currency,
        });
        emailSent = true;
      } catch (emailError: any) {
        console.error("Email send failed:", emailError.message);
        // Don't fail the whole request if email fails
      }
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "proposal_viewed",
      title: "Proposal Sent",
      message: `"${proposal.title}" was sent to ${clientName}${emailSent ? " via email" : ""}`,
      link: `/dashboard/proposals/${id}`,
    });

    return NextResponse.json({
      success: true,
      emailSent,
      publicUrl: proposalUrl,
      message: emailSent
        ? `Proposal sent to ${clientEmail}`
        : clientEmail
          ? "Proposal marked as sent (email delivery failed, share the link manually)"
          : "Proposal marked as sent. Share the link with your client.",
    });
  } catch (error: any) {
    console.error("Send proposal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
