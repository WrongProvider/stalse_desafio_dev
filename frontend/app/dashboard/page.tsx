import Link from "next/link";

// Definição da interface com base no que o script do Pandas costuma gerar
interface DashboardMetrics {
  total_tickets?: number;
  top_categories?: Record<string, number>; // formato: { "Categoria": valor }
  tickets_per_day?: Record<string, number>; // formato: { "Data": valor }
}

async function getMetrics(): Promise<DashboardMetrics | null> {
  try {
    // Altera para o URL correto do teu backend se necessário
    const res = await fetch("http://localhost:8000/metrics", {
      cache: "no-store", // Garante que lê sempre os dados mais recentes gerados pelo ETL
    });

    if (!res.ok) {
      throw new Error("Falha ao procurar métricas");
    }

    return res.json();
  } catch (error) {
    console.error("Erro ao buscar métricas do dashboard:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const metrics = await getMetrics();

  if (!metrics) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Erro no Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Não foi possível carregar as métricas. Certifica-te de que o script
            ETL foi executado e que o backend está online.
          </p>
          <Link
            href="/tickets"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            ← Voltar para a listagem de Tickets
          </Link>
        </div>
      </div>
    );
  }

  // Fallbacks simples caso o JSON varie um pouco de estrutura
  const topCategories = metrics.top_categories
    ? Object.entries(metrics.top_categories).map(([category, count]) => ({
        category,
        count,
      }))
    : [];

  const ticketsPerDay = metrics.tickets_per_day
    ? Object.entries(metrics.tickets_per_day).map(([date, count]) => ({
        date,
        count,
      }))
    : [];
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      {/* Cabeçalho */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard de Performance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Dados consolidados a partir do dataset do Kaggle via pipeline ETL
            (Pandas).
          </p>
        </div>
        <Link
          href="/tickets"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Visualizar Tickets →
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Bloco de Destaque / KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Total de Registos Processados
            </p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {metrics.total_tickets ?? "N/A"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Volume total analisado pelo Pandas
            </p>
          </div>

          {/* Card exemplo 2: Podes mapear outra métrica geral aqui */}
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200 border-l-4 border-l-emerald-500">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Status do Pipeline
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">
              Atualizado
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Pronto para consulta no frontend
            </p>
          </div>
        </div>

        {/* Tabelas de Dados Compartimentadas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tabela: Top Categorias */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Categorias
              </h2>
              <p className="text-xs text-gray-500">
                Categorias mais recorrentes detetadas no dataset
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topCategories.length > 0 ? (
                    topCategories.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-600 font-mono">
                          {item.count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        Nenhuma categoria encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabela: Volumetria por Dia */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Quantidade por Dia
              </h2>
              <p className="text-xs text-gray-500">
                Histórico de volumetria extraído no parse de datas
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase tracking-wider">
                      Total de Ocorrências
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ticketsPerDay.length > 0 ? (
                    ticketsPerDay.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-600 font-mono">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {item.count}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-6 py-4 text-center text-gray-400"
                      >
                        Nenhum dado diário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
