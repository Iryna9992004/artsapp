interface Author {
  email: string;
  full_name: string;
}

export interface FeedMessageProps {
  text: string;
  timestamp: string;
  author: Author;
  messagesCount?: number;
  colorNumber: string;
}
