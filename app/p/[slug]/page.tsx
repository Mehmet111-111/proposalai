import { createServerSupabaseClient as createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ClientProposalView from "./ClientProposalView";

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
    .select("full_name, business_name, email")
    .eq("id", proposal.user_id)
    .single();

  return (
    <ClientProposalView
      proposal={JSON.parse(JSON.stringify(proposal))}
      profile={JSON.parse(JSON.stringify(profile))}
      shouldMarkViewed={proposal.status === "sent"}
    />
  );
}
