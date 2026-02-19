import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ClientProposalView from "./ClientProposalView";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: proposal } = await supabase
    .from("proposals")
    .select("title, content")
    .eq("slug", slug)
    .single();

  if (!proposal) return { title: "Proposal Not Found" };

  const content = proposal.content as any;
  return {
    title: `${proposal.title} — ProposalAI`,
    description: content?.summary || "View this professional proposal",
    openGraph: {
      title: proposal.title,
      description: content?.summary || "View this professional proposal",
      type: "article",
    },
  };
}

export default async function PublicProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*, clients(name, company)")
    .eq("slug", slug)
    .single();

  if (!proposal) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, business_name, email, brand_color, subscription_plan")
    .eq("id", proposal.user_id)
    .single();

  const showWatermark = !profile?.subscription_plan || profile.subscription_plan === "free";

  return (
    <ClientProposalView
      proposal={JSON.parse(JSON.stringify(proposal))}
      profile={JSON.parse(JSON.stringify(profile))}
      shouldMarkViewed={proposal.status === "sent"}
      showWatermark={showWatermark}
    />
  );
}
