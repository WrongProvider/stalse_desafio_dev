import Link from "next/link";

async function getTickets() {
  const res = await fetch("http://localhost:8000/tickets", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export default async function TicketsPage() {
  const tickets = await getTickets();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tickets</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t: any) => (
            <tr key={t.id}>
              <td className="border p-2">{t.id}</td>
              <td className="border p-2">{t.customer_name}</td>
              <td className="border p-2">{t.subject}</td>
              <td className="border p-2">{t.status}</td>
              <td className="border p-2">{t.priority}</td>
              <td className="border p-2 text-blue-500">
                <Link href={`/tickets/${t.id}`}>Editar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
