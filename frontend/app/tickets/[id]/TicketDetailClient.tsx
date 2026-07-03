// app/tickets/[id]/TicketDetailClient.tsx
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUpdateTicket } from "@/hooks/useUpdateTicket";
import { TicketUpdateFields, Ticket } from "@/lib/api";
import { formatDate } from "@/lib/format";

export default function TicketDetailClient({ ticket }: { ticket: Ticket }) {
  const router = useRouter();
  const { updateTicket, isUpdating, error } = useUpdateTicket();

  const handleUpdate = async (fields: TicketUpdateFields) => {
    const result = await updateTicket(ticket.id, fields);
    if (result?.success) {
      // router.refresh() força o Next.js a re-buscar os dados do Server Component
      // atualizando a tela com os novos valores salvos no banco SQLite
      router.refresh();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-green-100 text-green-700 border-green-200";
      case "pendente":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "fechado":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-rose-100 text-rose-700 border-rose-200 font-semibold";
      case "media":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "baixa":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Link para Voltar */}
      <Link
        href="/tickets"
        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
      >
        &larr; Voltar para a lista
      </Link>

      {/* Card de Detalhes do Ticket */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="font-mono text-xs text-gray-400">
              Ticket #{ticket.id}
            </span>
            <h1 className="text-xl font-bold text-gray-900 mt-1">
              {ticket.subject}
            </h1>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(ticket.status)}`}
            >
              {ticket.status}
            </span>
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getPriorityStyle(ticket.priority)}`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>

        {/* Informações do Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-900">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Cliente
            </span>
            <p className="font-medium">{ticket.customer_name}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Canal de Origem
            </span>
            <p className="capitalize">{ticket.channel || "Web"}</p>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Aberto em
            </span>
            <p>{formatDate(ticket.created_at)}</p>
          </div>
        </div>

        {/* Feedback de erro caso a API falhe */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        {/* Seção de Ações (Mudar Status e Prioridade) */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Ações de Atendimento
          </h3>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Botões para Alterar Status */}
            <div className="flex-1 space-y-2">
              <span className="block text-xs text-gray-500">
                Alterar Status:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={isUpdating || ticket.status === "aberto"}
                  onClick={() => handleUpdate({ status: "aberto" })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Abrir
                </button>
                <button
                  disabled={isUpdating || ticket.status === "pendente"}
                  onClick={() => handleUpdate({ status: "pendente" })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Pendente
                </button>
                <button
                  disabled={isUpdating || ticket.status === "fechado"}
                  onClick={() => handleUpdate({ status: "fechado" })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                >
                  Fechar Chamado
                </button>
              </div>
            </div>

            {/* Botões para Alterar Prioridade */}
            <div className="flex-1 space-y-2">
              <span className="block text-xs text-gray-500">
                Alterar Prioridade:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  disabled={isUpdating || ticket.priority === "baixa"}
                  onClick={() => handleUpdate({ priority: "baixa" })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Baixa
                </button>
                <button
                  disabled={isUpdating || ticket.priority === "media"}
                  onClick={() => handleUpdate({ priority: "media" })}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Média
                </button>
                <button
                  disabled={isUpdating || ticket.priority === "alta"}
                  onClick={() => handleUpdate({ priority: "alta" })}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                >
                  Alta ⚡
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
