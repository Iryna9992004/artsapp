import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @IsString()
  @IsNotEmpty()
  public readonly post_description: string;

  @IsNumber()
  @IsNotEmpty()
  public readonly user_id: number;
}
