import { IsNumber } from 'class-validator';

export class ReadTopicDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  topic_id: number;
}
