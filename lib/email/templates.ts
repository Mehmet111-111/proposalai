import { resend, EMAIL_FROM } from "./resend";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// ============================================
// 1. Send Proposal to Client
// ============================================
export async function sendProposalEmail({
  to,
  clientName,
  proposalTitle,
  freelancerName,
  proposalUrl,
  totalAmount,
  currency,
}: {
  to: string;
  clientName: string;
  proposalTitle: string;
  freelancerName: string;
  proposalUrl: string;
  totalAmount?: number;
  currency?: string;
}) {
  const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "TRY" ? "₺" : "$";

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [to],
    subject: `New Proposal: ${proposalTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #10b981; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">⚡ ProposalAI</h1>
        </div>
        
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #1e293b;">Hi ${clientName || "there"},</p>
          
          <p style="font-size: 16px; color: #475569;">
            <strong>${freelancerName}</strong> has sent you a project proposal:
          </p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h2 style="margin: 0 0 8px 0; color: #1e293b; font-size: 20px;">${proposalTitle}</h2>
            ${totalAmount ? `<p style="margin: 0; color: #10b981; font-size: 24px; font-weight: bold;">${currencySymbol}${totalAmount.toLocaleString()}</p>` : ""}
          </div>
          
          <div style="text-align: center; margin: 32px 0;">
            <a href="${proposalUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              View Proposal →
            </a>
          </div>
          
          <p style="font-size: 14px; color: #94a3b8;">
            You can review the proposal, choose a package, and accept or decline directly from the link above.
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Sent via ProposalAI — AI-powered proposals for freelancers</p>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}

// ============================================
// 2. Proposal Accepted Notification
// ============================================
export async function sendProposalAcceptedEmail({
  to,
  freelancerName,
  clientName,
  proposalTitle,
  selectedPackage,
  totalAmount,
  currency,
  proposalUrl,
}: {
  to: string;
  freelancerName: string;
  clientName: string;
  proposalTitle: string;
  selectedPackage: string;
  totalAmount: number;
  currency?: string;
  proposalUrl: string;
}) {
  const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "TRY" ? "₺" : "$";

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [to],
    subject: `🎉 Proposal Accepted: ${proposalTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 Proposal Accepted!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #1e293b;">Great news, ${freelancerName}!</p>
          <p style="font-size: 16px; color: #475569;">
            <strong>${clientName}</strong> has accepted your proposal.
          </p>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <h2 style="margin: 0 0 8px 0; color: #1e293b;">${proposalTitle}</h2>
            <p style="margin: 4px 0; color: #475569;">Package: <strong>${selectedPackage}</strong></p>
            <p style="margin: 4px 0; color: #10b981; font-size: 28px; font-weight: bold;">${currencySymbol}${totalAmount.toLocaleString()}</p>
          </div>
          <p style="font-size: 14px; color: #475569;">An invoice has been automatically generated. Check your dashboard for details.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${proposalUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View in Dashboard →
            </a>
          </div>
        </div>
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">ProposalAI — AI-powered proposals for freelancers</p>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}

// ============================================
// 3. Proposal Rejected Notification
// ============================================
export async function sendProposalRejectedEmail({
  to,
  freelancerName,
  clientName,
  proposalTitle,
  proposalUrl,
}: {
  to: string;
  freelancerName: string;
  clientName: string;
  proposalTitle: string;
  proposalUrl: string;
}) {
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [to],
    subject: `Proposal Update: ${proposalTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #64748b; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Proposal Update</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #1e293b;">Hi ${freelancerName},</p>
          <p style="font-size: 16px; color: #475569;">
            Unfortunately, <strong>${clientName}</strong> has declined the proposal "<strong>${proposalTitle}</strong>".
          </p>
          <p style="font-size: 14px; color: #475569;">
            Don't worry — you can create a revised proposal or reach out to discuss their needs further.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${proposalUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Details →
            </a>
          </div>
        </div>
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">ProposalAI — AI-powered proposals for freelancers</p>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}

// ============================================
// 4. Invoice Email
// ============================================
export async function sendInvoiceEmail({
  to,
  clientName,
  invoiceNumber,
  totalAmount,
  currency,
  dueDate,
  freelancerName,
  invoiceUrl,
}: {
  to: string;
  clientName: string;
  invoiceNumber: string;
  totalAmount: number;
  currency?: string;
  dueDate: string;
  freelancerName: string;
  invoiceUrl: string;
}) {
  const currencySymbol = currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency === "TRY" ? "₺" : "$";

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: [to],
    subject: `Invoice ${invoiceNumber} from ${freelancerName}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e293b; padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0;">Invoice ${invoiceNumber}</h1>
        </div>
        <div style="padding: 32px;">
          <p style="font-size: 16px; color: #1e293b;">Hi ${clientName},</p>
          <p style="font-size: 16px; color: #475569;">
            <strong>${freelancerName}</strong> has sent you an invoice.
          </p>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
            <p style="margin: 0 0 4px 0; color: #64748b; font-size: 14px;">Amount Due</p>
            <p style="margin: 0; color: #1e293b; font-size: 32px; font-weight: bold;">${currencySymbol}${totalAmount.toLocaleString()}</p>
            <p style="margin: 8px 0 0 0; color: #ef4444; font-size: 14px;">Due: ${new Date(dueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${invoiceUrl}" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Invoice →
            </a>
          </div>
        </div>
        <div style="background: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">ProposalAI — AI-powered proposals for freelancers</p>
        </div>
      </div>
    `,
  });

  if (error) throw new Error(`Email send failed: ${error.message}`);
  return data;
}
