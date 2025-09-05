import { IsString, IsEmail, Length } from 'class-validator';

export class UserDto {
  @IsString()
  full_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 50)
  pass: string;
}
