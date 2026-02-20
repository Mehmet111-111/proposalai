import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getCurrencySymbol(currency: string): string {
  const map: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", TRY: "₺", CAD: "C$", AUD: "A$",
  };
  return map[currency] || "$";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, clients(name, company, email)")
      .eq("id", id)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name, email, phone, website, brand_color")
      .eq("id", invoice.user_id)
      .single();

    const items = (invoice.items as any[]) || [];
    const currency = invoice.currency || "USD";
    const cs = getCurrencySymbol(currency);
    const brandColor = profile?.brand_color || "#10b981";
    const isOverdue = invoice.status === "sent" && new Date(invoice.due_date) < new Date();

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${invoice.invoice_number} — Invoice</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1e293b;
      background: white;
      line-height: 1.6;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    @page { size: A4; margin: 0; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 40px 50px; }
    @media print {
      .page { padding: 30px 40px; }
      .no-print { display: none !important; }
    }
    @media screen {
      body { padding-top: 56px; background: #f1f5f9; }
      .page { background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin: 20px auto; border-radius: 4px; }
    }
    .print-bar {
      position: fixed; top: 0; left: 0; right: 0;
      background: #0f172a; color: white;
      padding: 12px 24px; display: flex; align-items: center;
      justify-content: space-between; z-index: 100;
    }
    .print-btn {
      background: ${brandColor}; color: white; border: none;
      padding: 8px 24px; border-radius: 8px; font-weight: 600;
      font-size: 14px; cursor: pointer; font-family: inherit;
    }
    .header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 40px; padding-bottom: 24px;
      border-bottom: 3px solid ${brandColor};
    }
    .brand-icon {
      width: 44px; height: 44px; background: ${brandColor};
      border-radius: 10px; display: flex; align-items: center;
      justify-content: center; color: white; font-weight: 800; font-size: 20px;
    }
    .invoice-label {
      font-size: 32px; font-weight: 800; color: #0f172a;
      text-transform: uppercase; letter-spacing: 2px;
    }
    .info-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 32px;
      margin-bottom: 32px;
    }
    .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 4px; }
    .info-value { font-size: 14px; color: #1e293b; }
    .info-value.bold { font-weight: 600; }
    .details-row {
      display: flex; gap: 32px; margin-bottom: 32px;
      padding: 16px 20px; background: #f8fafc; border-radius: 10px;
    }
    .details-item { font-size: 13px; color: #64748b; }
    .details-item strong { color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    thead th {
      text-align: left; padding: 12px 16px; font-size: 11px;
      font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      color: #64748b; background: #f8fafc; border-bottom: 2px solid #e2e8f0;
    }
    thead th:last-child, thead th:nth-child(2), thead th:nth-child(3) { text-align: right; }
    tbody td {
      padding: 14px 16px; font-size: 14px; color: #475569;
      border-bottom: 1px solid #f1f5f9;
    }
    tbody td:last-child, tbody td:nth-child(2), tbody td:nth-child(3) { text-align: right; }
    tbody td:first-child { color: #1e293b; font-weight: 500; }
    tbody td:last-child { font-weight: 600; color: #1e293b; }
    .totals { display: flex; justify-content: flex-end; }
    .totals-box { width: 260px; }
    .totals-row {
      display: flex; justify-content: space-between; padding: 8px 0;
      font-size: 14px; color: #64748b;
    }
    .totals-row.total {
      padding-top: 12px; margin-top: 8px; border-top: 2px solid #e2e8f0;
      font-size: 20px; font-weight: 800; color: #0f172a;
    }
    .paid-stamp {
      text-align: center; margin-top: 40px;
      padding: 16px; border: 3px solid #10b981; border-radius: 12px;
      display: inline-block;
    }
    .paid-stamp span { font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: 4px; }
    .overdue-badge { color: #ef4444; font-weight: 600; }
    .notes { margin-top: 32px; padding: 16px 20px; background: #f8fafc; border-radius: 10px; font-size: 13px; color: #64748b; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span style="font-size:14px;font-weight:600;">${invoice.invoice_number}</span>
    <div style="display:flex;gap:10px;">
      <button class="print-btn" onclick="window.print()">⬇ Download PDF</button>
      <button class="print-btn" onclick="window.close()" style="background:#475569">✕ Close</button>
    </div>
  </div>

  <div class="page">
    <div class="header">
      <div style="display:flex;align-items:center;gap:12px;">
        <div class="brand-icon">${(profile?.business_name || "P")[0].toUpperCase()}</div>
        <div>
          <div style="font-size:18px;font-weight:700;color:#1e293b;">${profile?.business_name || "ProposalAI"}</div>
          ${profile?.full_name ? `<div style="font-size:12px;color:#94a3b8;">${profile.full_name}</div>` : ""}
        </div>
      </div>
      <div class="invoice-label">Invoice</div>
    </div>

    <div class="info-grid">
      <div>
        <div class="info-label">From</div>
        <div class="info-value bold">${profile?.business_name || profile?.full_name || "—"}</div>
        ${profile?.email ? `<div class="info-value">${profile.email}</div>` : ""}
        ${profile?.phone ? `<div class="info-value">${profile.phone}</div>` : ""}
        ${profile?.website ? `<div class="info-value">${profile.website}</div>` : ""}
      </div>
      <div>
        <div class="info-label">Bill To</div>
        <div class="info-value bold">${invoice.clients?.name || "—"}</div>
        ${invoice.clients?.company ? `<div class="info-value">${invoice.clients.company}</div>` : ""}
        ${invoice.clients?.email ? `<div class="info-value">${invoice.clients.email}</div>` : ""}
      </div>
    </div>

    <div class="details-row">
      <div class="details-item">Invoice # <strong>${invoice.invoice_number}</strong></div>
      <div class="details-item">Issue Date <strong>${new Date(invoice.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong></div>
      <div class="details-item">Due Date <strong class="${isOverdue ? "overdue-badge" : ""}">${new Date(invoice.due_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</strong></div>
      <div class="details-item">Currency <strong>${currency}</strong></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item: any) => `
          <tr>
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>${cs}${item.unit_price?.toLocaleString()}</td>
            <td>${cs}${item.total?.toLocaleString()}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>${cs}${invoice.subtotal?.toLocaleString()}</span>
        </div>
        ${invoice.tax_rate > 0 ? `
          <div class="totals-row">
            <span>Tax (${invoice.tax_rate}%)</span>
            <span>${cs}${invoice.tax_amount?.toLocaleString()}</span>
          </div>
        ` : ""}
        <div class="totals-row total">
          <span>Total</span>
          <span>${cs}${invoice.total_amount?.toLocaleString()}</span>
        </div>
      </div>
    </div>

    ${invoice.status === "paid" ? `
      <div style="text-align:center;margin-top:40px;">
        <div class="paid-stamp">
          <span>✓ PAID</span>
          ${invoice.paid_at ? `<div style="font-size:12px;color:#10b981;margin-top:4px;">${new Date(invoice.paid_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>` : ""}
        </div>
      </div>
    ` : ""}

    ${invoice.notes ? `<div class="notes"><strong>Notes:</strong> ${invoice.notes}</div>` : ""}

    <div class="footer">Created with ProposalAI · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("Invoice PDF error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
