import { DetailView } from "@/components/dashboard/views";

export default async function AntragDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DetailView id={id} />;
}
