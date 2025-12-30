interface Message {
  id: number;
  text: string;
  topic_id: string;
  user_id: number;
  author_name: string;
  reads_count: string;
  created_at: string;
}

export interface MessageListProps {
  data: Message[];
}
