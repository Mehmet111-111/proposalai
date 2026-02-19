import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Map Paddle price IDs to plan names
function getPlanFromPriceId(priceId: string): string {
  const priceMap: Record<string, string> = {
    [process.env.NEXT_PUBLIC_PADDLE_STARTER_PRICE_ID || "pri_starter"]: "starter",
    [process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || "pri_pro"]: "pro",
    [process.env.NEXT_PUBLIC_PADDLE_AGENCY_PRICE_ID || "pri_agency"]: "agency",
  };
  return priceMap[priceId] || "free";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    console.log(`[Paddle Webhook] Event: ${eventType}`);

    // Extract customer email from event data
    const customData = body.data?.custom_data;
    const userId = customData?.user_id;
    
    if (!userId) {
      console.log("[Paddle Webhook] No user_id in custom_data, skipping");
      return NextResponse.json({ received: true });
    }

    switch (eventType) {
      case "subscription.created":
      case "subscription.updated": {
        const status = body.data?.status; // active, paused, canceled
        const priceId = body.data?.items?.[0]?.price?.id;
        const plan = getPlanFromPriceId(priceId);
        const subscriptionId = body.data?.id;

        if (status === "active") {
          await supabase
            .from("profiles")
            .update({
              subscription_plan: plan,
              paddle_subscription_id: subscriptionId,
              paddle_customer_id: body.data?.customer_id,
            })
            .eq("id", userId);

          console.log(`[Paddle] User ${userId} upgraded to ${plan}`);
        } else if (status === "canceled" || status === "paused") {
          await supabase
            .from("profiles")
            .update({
              subscription_plan: "free",
            })
            .eq("id", userId);

          console.log(`[Paddle] User ${userId} downgraded to free (${status})`);
        }
        break;
      }

      case "subscription.canceled": {
        await supabase
          .from("profiles")
          .update({ subscription_plan: "free" })
          .eq("id", userId);

        console.log(`[Paddle] User ${userId} subscription canceled`);
        break;
      }

      case "transaction.completed": {
        // Payment received - could log or notify
        console.log(`[Paddle] Transaction completed for user ${userId}`);
        break;
      }

      default:
        console.log(`[Paddle Webhook] Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[Paddle Webhook] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
