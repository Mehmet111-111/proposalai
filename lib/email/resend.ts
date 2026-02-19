import { Resend } from "resend";

// Only initialize Resend if API key exists (prevents crash on Vercel without key)
export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const EMAIL_FROM = process.env.EMAIL_FROM || "ProposalAI <onboarding@resend.dev>";
