// Paddle configuration for ProposalAI subscriptions

export const PADDLE_PLANS = {
  starter: {
    name: "Starter",
    monthlyPrice: "$9/mo",
    yearlyPrice: "$90/yr",
    monthlyPriceId: "pri_01khw3d2gcbdpckbttfb0trhxy",
    yearlyPriceId: "pri_01khw3e36qppkhhfbyrsy16yh0",
    proposals: 20,
    features: [
      "20 proposals/month",
      "Remove watermark",
      "Proposal tracking",
      "5 templates",
      "Client management",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    monthlyPrice: "$19/mo",
    yearlyPrice: "$190/yr",
    monthlyPriceId: "pri_01khw3g0t1qpxc31et6e1wzt39",
    yearlyPriceId: "pri_01khw3h2peq6a9156mv32jx4bm",
    proposals: 999,
    features: [
      "Unlimited proposals",
      "Smart invoicing",
      "Custom branding",
      "Analytics dashboard",
      "All templates",
      "Priority support",
      "No watermark",
    ],
  },
  agency: {
    name: "Agency",
    monthlyPrice: "$39/mo",
    yearlyPrice: "$390/yr",
    monthlyPriceId: "pri_01khw3hzybqg4dbwvsd91cxsdd",
    yearlyPriceId: "pri_01khw3jmzzeh8fch91pfbc2p5z",
    proposals: 999,
    features: [
      "Everything in Pro",
      "5 team members",
      "Client portal",
      "API access",
      "White label",
      "Dedicated support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PADDLE_PLANS;

export function getPlanByPriceId(priceId: string) {
  for (const [key, plan] of Object.entries(PADDLE_PLANS)) {
    if (plan.monthlyPriceId === priceId || plan.yearlyPriceId === priceId) {
      return { key: key as PlanKey, plan };
    }
  }
  return null;
}
