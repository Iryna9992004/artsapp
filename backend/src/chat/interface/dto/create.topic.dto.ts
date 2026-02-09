import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  user_id: number;
}
