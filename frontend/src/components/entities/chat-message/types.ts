export interface ChatMessageProps {
  id: number;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  author: string;
  colorNumber: string;
  user_id: number;
}
