export class EventEntity {
  constructor(
    public title: string,
    public event_description: string,
    public created_at: string,
    public user_id: number,
  ) {}
}
