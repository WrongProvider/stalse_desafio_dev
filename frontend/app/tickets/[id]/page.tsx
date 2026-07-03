// app/tickets/[id]/page.tsx
import { notFound } from "next/navigation";
import TicketDetailClient from "./TicketDetailClient";
import { getTicket } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  // A partir do Next.js 15, o objeto params (assim como searchParams) em Server Components e rotas dinâmicas passou a ser uma Promise.
  // Portanto, você não pode mais acessar params.id diretamente de forma síncrona;
  // você precisa dar um await no objeto params antes de ler suas propriedades.

  const resolvedParams = await params;

  const ticket = await getTicket(resolvedParams.id);

  // Se o backend retornar 404 ou falhar, renderiza a página de 404 padrão do Next.js
  if (!ticket) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-6 sm:p-8 space-y-6">
      <TicketDetailClient ticket={ticket} />
    </main>
  );
}
