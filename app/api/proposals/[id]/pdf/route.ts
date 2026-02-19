import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function hexToRGB(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function getCurrencySymbol(currency: string): string {
  const map: Record<string, string> = {
    USD: "$", EUR: "E", GBP: "£", TRY: "TL", CAD: "C$", AUD: "A$",
  };
  return map[currency] || "$";
}

function formatAmount(amount: number, currency: string): string {
  return `${getCurrencySymbol(currency)}${amount.toLocaleString()}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: proposal } = await supabase
      .from("proposals")
      .select("*, clients(name, company, email)")
      .eq("id", id)
      .single();

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, business_name, email, brand_color")
      .eq("id", proposal.user_id)
      .single();

    const content = proposal.content as any;
    const currency = proposal.currency || "USD";
    const brandColor = profile?.brand_color || "#10b981";
    const [br, bg, bb] = hexToRGB(brandColor);

    // Build PDF using raw PDF construction (no external deps needed)
    // We'll generate HTML and return it for client-side printing, OR
    // use a simple approach with jsPDF on client side
    
    // For server-side, let's return structured data that the client renders as PDF
    // Actually, let's create a printable HTML page that auto-triggers print

    const validDate = proposal.valid_until
      ? new Date(proposal.valid_until).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric",
        })
      : "N/A";

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${content?.title || "Proposal"} - ProposalAI</title>
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

    @page {
      size: A4;
      margin: 0;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      padding: 40px 50px;
      position: relative;
    }

    @media print {
      .page { padding: 30px 40px; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 3px solid ${brandColor};
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 44px;
      height: 44px;
      background: ${brandColor};
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 20px;
    }

    .brand-name {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .brand-person {
      font-size: 12px;
      color: #94a3b8;
    }

    .meta {
      text-align: right;
      font-size: 12px;
      color: #64748b;
    }

    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #94a3b8;
      margin-bottom: 2px;
    }

    .meta-value {
      font-weight: 600;
      color: #1e293b;
    }

    /* Title */
    .title {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
      line-height: 1.2;
    }

    .summary {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 32px;
      max-width: 80%;
      line-height: 1.7;
    }

    .info-bar {
      display: flex;
      gap: 32px;
      padding: 16px 20px;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 36px;
      font-size: 13px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #64748b;
    }

    .info-item strong {
      color: #1e293b;
    }

    /* Section */
    .section {
      margin-bottom: 32px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .section-icon {
      width: 28px;
      height: 28px;
      background: ${brandColor}18;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    /* Scope */
    .scope-item {
      padding: 12px 0 12px 16px;
      border-left: 3px solid ${brandColor}50;
      margin-bottom: 12px;
    }

    .scope-item h4 {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .scope-item p {
      font-size: 13px;
      color: #64748b;
    }

    /* Timeline */
    .timeline-item {
      display: flex;
      gap: 14px;
      padding: 14px 18px;
      background: #f8fafc;
      border-radius: 10px;
      margin-bottom: 10px;
    }

    .timeline-num {
      width: 32px;
      height: 32px;
      background: ${brandColor};
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .timeline-phase {
      font-weight: 600;
      font-size: 14px;
      color: #1e293b;
    }

    .timeline-duration {
      font-size: 12px;
      color: #94a3b8;
    }

    /* Packages */
    .packages {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    .package {
      flex: 1;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
    }

    .package.recommended {
      border-color: ${brandColor};
      background: ${brandColor}08;
    }

    .package-badge {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: ${brandColor};
      margin-bottom: 8px;
    }

    .package-name {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .package-price {
      font-size: 26px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 14px;
    }

    .package-features {
      list-style: none;
    }

    .package-features li {
      font-size: 12px;
      color: #64748b;
      padding: 4px 0;
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }

    .check {
      color: ${brandColor};
      font-weight: 700;
      flex-shrink: 0;
    }

    /* Terms */
    .terms {
      font-size: 12px;
      color: #94a3b8;
      padding: 16px 20px;
      background: #f8fafc;
      border-radius: 10px;
      line-height: 1.7;
    }

    /* Footer */
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #cbd5e1;
    }

    /* Print button */
    .print-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      color: white;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .print-btn {
      background: ${brandColor};
      color: white;
      border: none;
      padding: 8px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      font-family: inherit;
    }

    .print-btn:hover { opacity: 0.9; }

    @media print {
      .print-bar { display: none; }
      body { padding-top: 0; }
    }

    @media screen {
      body { padding-top: 56px; background: #f1f5f9; }
      .page {
        background: white;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin: 20px auto;
        border-radius: 4px;
      }
    }
  </style>
</head>
<body>
  <!-- Print bar (hidden in print) -->
  <div class="print-bar no-print">
    <span style="font-size:14px;font-weight:600;">${content?.title || "Proposal"}</span>
    <div style="display:flex;gap:10px;">
      <button class="print-btn" onclick="window.print()" style="background:${brandColor}">⬇ Download PDF</button>
      <button class="print-btn" onclick="window.close()" style="background:#475569">✕ Close</button>
    </div>
  </div>

  <div class="page">
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <div class="brand-icon">${(profile?.business_name || "P")[0].toUpperCase()}</div>
        <div>
          <div class="brand-name">${profile?.business_name || "ProposalAI"}</div>
          ${profile?.full_name ? `<div class="brand-person">${profile.full_name}</div>` : ""}
        </div>
      </div>
      <div class="meta">
        <div class="meta-label">Prepared for</div>
        <div class="meta-value">${proposal.clients?.name || "Client"}</div>
        ${proposal.clients?.company ? `<div style="font-size:12px;color:#64748b">${proposal.clients.company}</div>` : ""}
      </div>
    </div>

    <!-- Title -->
    <h1 class="title">${content?.title || "Proposal"}</h1>
    ${content?.summary ? `<p class="summary">${content.summary}</p>` : ""}

    <!-- Info bar -->
    <div class="info-bar">
      <div class="info-item">📅 <span>Valid until <strong>${validDate}</strong></span></div>
      <div class="info-item">💰 <span>Currency: <strong>${currency}</strong></span></div>
      ${proposal.status ? `<div class="info-item">📋 <span>Status: <strong style="text-transform:capitalize">${proposal.status}</strong></span></div>` : ""}
    </div>

    <!-- Scope -->
    ${content?.scope && content.scope.length > 0 ? `
    <div class="section">
      <div class="section-title">
        <div class="section-icon">📝</div>
        Scope of Work
      </div>
      ${content.scope.map((item: any) => `
        <div class="scope-item">
          <h4>${item.title}</h4>
          <p>${item.description}</p>
        </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Timeline -->
    ${content?.timeline && content.timeline.length > 0 ? `
    <div class="section">
      <div class="section-title">
        <div class="section-icon">⏱</div>
        Project Timeline
      </div>
      ${content.timeline.map((phase: any, i: number) => `
        <div class="timeline-item">
          <div class="timeline-num">${i + 1}</div>
          <div>
            <div class="timeline-phase">${phase.phase}</div>
            <div class="timeline-duration">${phase.duration}</div>
          </div>
        </div>
      `).join("")}
    </div>
    ` : ""}

    <!-- Packages -->
    ${content?.packages && content.packages.length > 0 ? `
    <div class="section">
      <div class="section-title">
        <div class="section-icon">💎</div>
        Pricing Packages
      </div>
      <div class="packages">
        ${content.packages.map((pkg: any, i: number) => `
          <div class="package ${i === 1 ? "recommended" : ""}">
            ${i === 1 ? '<div class="package-badge">★ Recommended</div>' : ""}
            <div class="package-name">${pkg.name}</div>
            <div class="package-price">${formatAmount(pkg.price || 0, currency)}</div>
            <ul class="package-features">
              ${(pkg.features || []).map((f: string) => `
                <li><span class="check">✓</span> ${f}</li>
              `).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    </div>
    ` : ""}

    <!-- Terms -->
    ${content?.terms ? `
    <div class="section">
      <div class="section-title">
        <div class="section-icon">📃</div>
        Terms & Conditions
      </div>
      <div class="terms">${content.terms}</div>
    </div>
    ` : ""}

    <!-- Footer -->
    <div class="footer">
      Created with ProposalAI · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>

  <script>
    // Auto-print if ?print=true
    if (new URLSearchParams(window.location.search).get('print') === 'true') {
      window.onload = () => setTimeout(() => window.print(), 500);
    }
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
