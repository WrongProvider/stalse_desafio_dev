import DashboardClient from "./DashboardClient";

async function getMetrics() {
  try {
    const res = await fetch("http://localhost:8000/metrics", {
      cache: "no-store", // Sempre ignora o cache para ler alterações pós ETL
    });

    if (!res.ok) throw new Error("Falha ao buscar métricas");
    return res.json();
  } catch (error) {
    console.error("Erro no fetch do Dashboard:", error);
    return null;
  }
}

export default async function DashboardPage() {
  const metrics = await getMetrics();

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">
            Métricas indisponíveis
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Verifique se o script de ETL rodou com sucesso e se o backend está
            ativo.
          </p>
        </div>
      </div>
    );
  }

  return <DashboardClient metrics={metrics} />;
}
