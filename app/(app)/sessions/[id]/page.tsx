import { SessionDetailClient } from "@/components/session-detail-client";

export function generateStaticParams() {
  return [{ id: "d97c2f70fafe4c0f906b3f21ffe3907a" }];
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SessionDetailClient id={id} />;
}
