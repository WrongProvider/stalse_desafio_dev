// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Ticket {
  id: number;
  customer_name: string;
  channel?: string;
  subject: string;
  status: "aberto" | "pendente" | "fechado";
  priority: "baixa" | "media" | "alta";
  created_at?: string;
}

export interface TicketUpdateFields {
  status?: Ticket["status"];
  priority?: Ticket["priority"];
}

export async function getTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/tickets`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch tickets");
  return res.json();
}

export async function getTicket(id: string): Promise<Ticket | null> {
  const res = await fetch(`${API_URL}/tickets/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export async function getMetrics() {
  const res = await fetch(`${API_URL}/metrics`, { cache: "no-store" });
  if (!res.ok) throw new Error("Falha ao buscar métricas");
  return res.json();
}

export async function updateTicket(
  id: number | string,
  data: TicketUpdateFields,
): Promise<Ticket> {
  const res = await fetch(`${API_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao atualizar o ticket");
  return res.json();
}
