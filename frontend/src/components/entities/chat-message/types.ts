interface Author {
  email: string;
  full_name: string;
}
export interface ChatMessageProps {
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  author: Author;
  colorNumber: string;
}
