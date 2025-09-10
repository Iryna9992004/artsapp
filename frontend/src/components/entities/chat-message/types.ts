export interface ChatMessageProps {
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isMine: boolean;
  colorNumber: string;
}
