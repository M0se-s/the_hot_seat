import { ProjectDetailPage } from "@/features/projects/ProjectDetailPage";

type Props = {
  params: Promise<{
    projectId: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { projectId } = await params;
  return <ProjectDetailPage projectId={projectId} />;
}
