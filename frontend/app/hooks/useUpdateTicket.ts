import { useState } from "react";
import { updateTicket as updateTicketApi } from "@/lib/api";
import { TicketUpdateFields } from "@/lib/api";

export function useUpdateTicket() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTicket = async (
    id: number | string,
    data: TicketUpdateFields,
  ) => {
    setIsUpdating(true);
    setError(null);

    try {
      const updatedTicket = await updateTicketApi(id, data);
      return { success: true, data: updatedTicket };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateTicket, isUpdating, error };
}
