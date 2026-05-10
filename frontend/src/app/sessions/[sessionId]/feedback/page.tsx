import { FeedbackReportPage } from "@/features/sessions/FeedbackReportPage";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { sessionId } = await params;
  return <FeedbackReportPage sessionId={sessionId} />;
}
