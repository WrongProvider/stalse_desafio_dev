import { useState } from "react";

export function useUpdateTicket() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTicket = async (
    id: number | string,
    data: {
      status?: "open" | "pending" | "closed";
      priority?: "low" | "medium" | "high";
    },
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:8000/tickets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Falha ao atualizar o ticket");
      }

      const updatedTicket = await res.json();
      return { success: true, data: updatedTicket };
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
      return { success: false, error: err.message };
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateTicket, isUpdating, error };
}
