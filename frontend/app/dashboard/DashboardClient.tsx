"use client";

import Link from "next/link";
import { useInfiniteMetrics } from "../hooks/useInfiniteMetrics";

interface DashboardClientProps {
  metrics: {
    total_tickets?: number;
    top_categories?: Record<string, number>;
    tickets_per_day?: Record<string, number>;
  };
}

export default function DashboardClient({ metrics }: DashboardClientProps) {
  // Aplicando o hook para as duas tabelas de forma independente
  const categories = useInfiniteMetrics(metrics.top_categories, 6);
  const dailyData = useInfiniteMetrics(metrics.tickets_per_day, 8);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-8 text-slate-800">
      {/* Cabeçalho Premium */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Métricas de Performance
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            Dashboard Executivo
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Análise volumétrica e processamento de dados obtidos via pipeline
            ETL Pandas.
          </p>
        </div>
        <Link
          href="/tickets"
          className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 gap-2"
        >
          ← Voltar para Tickets
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-600"></div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total de Registros Processados
            </p>
            <p className="text-4xl font-black text-slate-900 mt-2 tracking-tight group-hover:scale-105 transition-transform origin-left">
              {metrics.total_tickets ?? "N/A"}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Volume total indexado na base SQLite
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Status do Pipeline
            </p>
            <p className="text-3xl font-bold text-emerald-600 mt-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Atualizado
            </p>
            <p className="text-xs text-slate-400 mt-3">
              Pronto para auditoria e tomada de decisão
            </p>
          </div>
        </div>

        {/* Seção das Tabelas Dinâmicas com Scroll Infinito */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tabela: Top Categorias */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-[480px]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Top Categorias</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Categorias com maior recorrência de chamados
              </p>
            </div>

            <div className="overflow-y-auto flex-1 px-6 divide-y divide-slate-100">
              {categories.visibleItems.length > 0 ? (
                <>
                  {categories.visibleItems.map((item, index) => (
                    <div
                      key={index}
                      className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                    >
                      <span className="font-medium text-slate-800">
                        {item.key}
                      </span>
                      <span className="font-mono text-sm font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                        {item.value}
                      </span>
                    </div>
                  ))}

                  {/* Elemento Sentinela para o Infinite Scroll */}
                  {categories.hasMore && (
                    <div
                      ref={categories.loaderRef}
                      className="py-6 text-center text-xs text-indigo-600 font-medium animate-pulse"
                    >
                      Carregando mais categorias...
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Nenhuma categoria encontrada
                </div>
              )}
            </div>
          </div>

          {/* Tabela: Volumetria por Dia */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-[480px]">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-slate-900">Quantidade por Data</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribuição cronológica do volume
              </p>
            </div>

            <div className="overflow-y-auto flex-1 px-6 divide-y divide-slate-100">
              {dailyData.visibleItems.length > 0 ? (
                <>
                  {dailyData.visibleItems.map((item, index) => (
                    <div
                      key={index}
                      className="py-4 flex items-center justify-between hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                    >
                      <span className="font-mono text-sm text-slate-600">
                        {item.key}
                      </span>
                      <span className="font-semibold text-slate-900 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md">
                        {item.value} chamados
                      </span>
                    </div>
                  ))}

                  {/* Elemento Sentinela para o Infinite Scroll */}
                  {dailyData.hasMore && (
                    <div
                      ref={dailyData.loaderRef}
                      className="py-6 text-center text-xs text-indigo-600 font-medium animate-pulse"
                    >
                      Carregando mais datas...
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  Nenhum dado diário encontrado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
