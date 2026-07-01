// app/tickets/[id]/page.tsx
import { notFound } from "next/navigation";
import TicketDetailClient from "./TicketDetailClient";

async function getTicket(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/tickets/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar ticket:", error);
    return null;
  }
}

export default async function TicketDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // No Next. App Router, parâmetros de rotas dinâmicas vêm em params
  const ticket = await getTicket(params.id);

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
