// Paddle configuration for ProposalAI subscriptions
// Uses Paddle.js v2 (already installed: @paddle/paddle-js)

export const PADDLE_PLANS = {
  starter: {
    name: "Starter",
    price: "$12/mo",
    priceId: process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || "pri_starter",
    proposals: 20,
    features: ["20 proposals/month", "Remove watermark", "Proposal tracking", "5 templates", "Client management"],
  },
  pro: {
    name: "Pro",
    price: "$29/mo",
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || "pri_pro",
    proposals: 999,
    features: ["Unlimited proposals", "Smart invoicing", "Custom branding", "Analytics dashboard", "All templates", "Priority support"],
  },
  agency: {
    name: "Agency",
    price: "$79/mo",
    priceId: process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID || "pri_agency",
    proposals: 999,
    features: ["Everything in Pro", "5 team members", "Client portal", "API access", "White label", "Dedicated support"],
  },
} as const;

export type PlanKey = keyof typeof PADDLE_PLANS;
