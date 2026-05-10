import { LiveSessionPage } from "@/features/sessions/LiveSessionPage";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { sessionId } = await params;
  return <LiveSessionPage sessionId={sessionId} />;
}
