export class MessageEntity {
  constructor(
    public text: string,
    public chat_id: number,
    public user_id: number,
  ) {}
}
