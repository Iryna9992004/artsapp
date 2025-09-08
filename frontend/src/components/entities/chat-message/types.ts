export interface ChatMessageProps {
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isMine: boolean;
  messagesCount: number;
  colorNumber: number;
}