import { useEffect, useState } from "react";

export interface EventPayload {
  service: string;
  action: string;
  userId: string;
  occurredAt: string;
  updatedFields?: string[];
  changes?: Record<string, any>;
  name?: string;
}

export function useEventToast(apiUrl: string) {
  const [toastMessage, setToastMessage] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`${apiUrl}/user/stream`, {
      withCredentials: true,
    });

    const handleEvent = (event: MessageEvent) => {
      try {
        const payload: EventPayload = JSON.parse(event.data);
        const text = `User ${payload.userId.slice(0, 8)}... memperbarui profil (${payload.updatedFields?.join(", ") || "data"})`;

        setToastMessage({ id: Date.now(), text });
      } catch (err) {
        console.error("Gagal parse SSE:", err);
      }
    };

    eventSource.addEventListener("profile_update_event", handleEvent);
    
    eventSource.onmessage = handleEvent;

    eventSource.onerror = (err) => {
      console.warn("Koneksi SSE terputus / reconnecting...", err);
    };

    return () => {
      eventSource.close();
    };
  }, [apiUrl]);

  return { toastMessage, clearToast: () => setToastMessage(null) };
}