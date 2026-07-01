"use client";

import { useState } from "react";
import Link from "next/link";

interface Ticket {
  id: number;
  customer_name: string;
  channel?: string;
  subject: string;
  status: "open" | "pending" | "closed";
  priority: "low" | "medium" | "high";
  created_at?: string;
}

export default function TicketTable({
  initialTickets,
}: {
  initialTickets: Ticket[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtro simples por cliente, assunto ou canal
  const filteredTickets = initialTickets.filter((t) =>
    `${t.customer_name} ${t.subject} ${t.channel || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "closed":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-100 text-rose-700 border-rose-200 font-semibold";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Barra de Busca */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por cliente, assunto ou canal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        />
      </div>

      {/* Tabela Estilizada */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-xs">
        <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-900">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Cliente</th>
              <th className="px-6 py-4">Canal</th>
              <th className="px-6 py-4">Assunto</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Prioridade</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    #{t.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {t.customer_name}
                  </td>
                  <td className="px-6 py-4 capitalize text-gray-600">
                    {t.channel || "Web"}
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                    {t.subject}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(t.status)}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${getPriorityStyle(t.priority)}`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/tickets/${t.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 shadow-xs hover:bg-gray-50"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-sm text-gray-500"
                >
                  Nenhum ticket encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
