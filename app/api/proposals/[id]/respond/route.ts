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

      await supabase.from("notifications").insert({
        user_id: proposal.user_id,
        type: "proposal_accepted",
        title: "Proposal Accepted! 🎉",
        message: `${clientName || "Client"} accepted "${proposal.title}" (${selectedPackage || "Standard"} - $${totalAmount.toLocaleString()})`,
        link: `/dashboard/proposals/${proposal.id}`,
      });

      return NextResponse.json({
        success: true,
        message: "Proposal accepted! Invoice has been generated.",
        invoiceNumber,
      });
    } else {
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

      return NextResponse.json({ success: true, message: "Proposal declined." });
    }
  } catch (error: any) {
    console.error("Respond error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
