import TicketTable from "./TicketTable";
import { getTickets } from "@/lib/api";

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <main className="mx-auto w-full max-w-7xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Inbox de Tickets
        </h1>
        <p className="text-sm text-gray-500">
          Gerencie os chamados de suporte e acompanhe o status de atendimento.
        </p>
      </div>

      <TicketTable initialTickets={tickets} />
    </main>
  );
}
