import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  event_description: string;

  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
