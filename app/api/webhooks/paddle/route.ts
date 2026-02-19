import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPlanByPriceId } from "@/lib/paddle";

// Service role client to bypass RLS
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const eventType = body.event_type;

    console.log(`[Paddle Webhook] Event: ${eventType}`, JSON.stringify(body.data?.custom_data));

    // Extract user_id from custom_data (passed during checkout)
    const customData = body.data?.custom_data;
    const userId = customData?.user_id;
    
    if (!userId) {
      console.log("[Paddle Webhook] No user_id in custom_data, skipping");
      return NextResponse.json({ received: true });
    }

    switch (eventType) {
      case "subscription.created":
      case "subscription.updated": {
        const status = body.data?.status;
        const priceId = body.data?.items?.[0]?.price?.id;
        const result = getPlanByPriceId(priceId || "");
        const plan = result?.key || "free";
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

          // Create notification
          await supabase.from("notifications").insert({
            user_id: userId,
            type: "proposal_accepted",
            title: `Upgraded to ${result?.plan.name || plan}! 🎉`,
            message: `Your subscription is now active. Enjoy your new features!`,
            link: "/dashboard/settings",
          });

          console.log(`[Paddle] User ${userId} upgraded to ${plan}`);
        } else if (status === "canceled" || status === "paused" || status === "past_due") {
          await supabase
            .from("profiles")
            .update({ subscription_plan: "free" })
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
