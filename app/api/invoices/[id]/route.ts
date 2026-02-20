import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { sendInvoiceEmail } from "@/lib/email";

const APP_URL = "https://proposalai.app";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action } = body;

    // Get invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, clients(name, email, company)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    // Get profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name")
      .eq("id", user.id)
      .single();

    const freelancerName = profile?.business_name || profile?.full_name || "Freelancer";

    if (action === "mark_paid") {
      await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("id", id);

      // Create notification
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "invoice_paid",
        title: "Invoice Paid! 💰",
        message: `${invoice.invoice_number} marked as paid (${invoice.total_amount?.toLocaleString()} ${invoice.currency || "USD"})`,
        link: `/dashboard/invoices/${id}`,
      });

      return NextResponse.json({ success: true, message: "Invoice marked as paid!" });
    }

    if (action === "send_email") {
      const clientEmail = invoice.clients?.email;
      if (!clientEmail) {
        return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
      }

      try {
        await sendInvoiceEmail({
          to: clientEmail,
          clientName: invoice.clients?.name || "Client",
          invoiceNumber: invoice.invoice_number,
          totalAmount: invoice.total_amount,
          currency: invoice.currency,
          dueDate: invoice.due_date,
          freelancerName,
          invoiceUrl: `${APP_URL}/api/invoices/${id}/pdf`,
        });
        return NextResponse.json({ success: true, message: `Reminder sent to ${clientEmail}` });
      } catch (emailErr: any) {
        return NextResponse.json({ error: `Email failed: ${emailErr.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
