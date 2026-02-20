import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendProposalAcceptedEmail, sendProposalRejectedEmail, sendInvoiceEmail } from "@/lib/email";

const APP_URL = "https://proposalai.app";

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
    const body = await request.json();
    const { action, selectedPackage, clientName } = body;

    if (!action || !["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const { data: proposal } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // Get freelancer profile and email
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name, email")
      .eq("id", proposal.user_id)
      .single();

    // Get freelancer email from auth.users
    const { data: authUser } = await supabase.auth.admin.getUserById(proposal.user_id);
    const freelancerEmail = authUser?.user?.email || profile?.email;
    const freelancerName = profile?.business_name || profile?.full_name || "Freelancer";

    if (action === "accept") {
      const content = proposal.content as any;
      const pkg = content?.packages?.find((p: any) => p.name === selectedPackage) || content?.packages?.[1];
      const totalAmount = pkg?.price || proposal.total_amount || 0;

      await supabase
        .from("proposals")
        .update({
          status: "accepted",
          selected_package: selectedPackage || "Standard",
          total_amount: totalAmount,
          accepted_at: new Date().toISOString(),
        })
        .eq("id", id);

      // Auto-generate invoice
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
      const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

      await supabase.from("invoices").insert({
        user_id: proposal.user_id,
        client_id: proposal.client_id,
        proposal_id: proposal.id,
        invoice_number: invoiceNumber,
        items: [
          {
            description: `${proposal.title} - ${selectedPackage || "Standard"} Package`,
            quantity: 1,
            unit_price: totalAmount,
            total: totalAmount,
          },
        ],
        subtotal: totalAmount,
        tax_rate: 0,
        tax_amount: 0,
        total_amount: totalAmount,
        currency: proposal.currency || "USD",
        status: "sent",
        due_date: dueDate,
      });

      // Create notification
      await supabase.from("notifications").insert({
        user_id: proposal.user_id,
        type: "proposal_accepted",
        title: "Proposal Accepted! 🎉",
        message: `${clientName || "Client"} accepted "${proposal.title}" (${selectedPackage || "Standard"} - $${totalAmount.toLocaleString()})`,
        link: `/dashboard/proposals/${proposal.id}`,
      });

      // Send email to freelancer
      if (freelancerEmail) {
        try {
          await sendProposalAcceptedEmail({
            to: freelancerEmail,
            freelancerName,
            clientName: clientName || "Client",
            proposalTitle: proposal.title,
            selectedPackage: selectedPackage || "Standard",
            totalAmount,
            currency: proposal.currency,
            proposalUrl: `${APP_URL}/dashboard`,
          });
        } catch (emailErr) {
          console.error("Failed to send accepted email:", emailErr);
        }
      }

      // Send invoice email to client
      if (proposal.client_id) {
        const { data: client } = await supabase
          .from("clients")
          .select("name, email")
          .eq("id", proposal.client_id)
          .single();

        if (client?.email) {
          try {
            await sendInvoiceEmail({
              to: client.email,
              clientName: client.name || "Client",
              invoiceNumber,
              totalAmount,
              currency: proposal.currency,
              dueDate,
              freelancerName,
              invoiceUrl: `${APP_URL}/dashboard/invoices`,
            });
          } catch (invoiceEmailErr) {
            console.error("Failed to send invoice email:", invoiceEmailErr);
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: "Proposal accepted! Invoice has been generated.",
        invoiceNumber,
      });
    } else {
      // REJECT
      await supabase
        .from("proposals")
        .update({ status: "rejected" })
        .eq("id", id);

      await supabase.from("notifications").insert({
        user_id: proposal.user_id,
        type: "proposal_rejected",
        title: "Proposal Declined",
        message: `${clientName || "Client"} declined "${proposal.title}"`,
        link: `/dashboard/proposals/${proposal.id}`,
      });

      // Send email to freelancer
      if (freelancerEmail) {
        try {
          await sendProposalRejectedEmail({
            to: freelancerEmail,
            freelancerName,
            clientName: clientName || "Client",
            proposalTitle: proposal.title,
            proposalUrl: `${APP_URL}/dashboard`,
          });
        } catch (emailErr) {
          console.error("Failed to send rejected email:", emailErr);
        }
      }

      return NextResponse.json({ success: true, message: "Proposal declined." });
    }
  } catch (error: any) {
    console.error("Respond error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
