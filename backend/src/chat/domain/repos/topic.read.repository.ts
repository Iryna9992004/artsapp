export interface TopicReadRepository {
  markAsRead(user_id: number, topic_id: number): Promise<TopicReadRepository>;
}
