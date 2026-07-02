"use client";

import { useState } from "react";
import Link from "next/link";

interface Ticket {
  id: number;
  customer_name: string;
  channel?: string;
  subject: string;
  status: "aberto" | "pendente" | "fechado";
  priority: "baixa" | "media" | "alta";
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
      case "aberto":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "pendente":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "fechado":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "alta":
        return "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      case "media":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "baixa":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Barra de Busca */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Buscar por cliente, assunto ou canal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 text-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 transition-all"
        />
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 gap-2"
        >
          Ir para dashboard ➝
        </Link>
      </div>

      {/* Tabela Estilizada (card padronizado com o Dashboard) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-900">Chamados</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {filteredTickets.length}{" "}
            {filteredTickets.length === 1
              ? "chamado encontrado"
              : "chamados encontrados"}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-left text-sm text-slate-800">
            <thead className="bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-400">
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
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      #{t.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {t.customer_name}
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-500">
                      {t.channel || "Web"}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-500">
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
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-sm hover:bg-slate-50 transition-all active:scale-95"
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
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    Nenhum ticket encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
