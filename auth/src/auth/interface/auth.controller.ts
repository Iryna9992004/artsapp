import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUsecase } from '../application/register.usecase';
import { UserDto } from './dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUsecase: RegisterUsecase) {}

  @Post('register')
  async register(@Body() dto: UserDto) {
    return this.registerUsecase.exec(dto);
  }
}
