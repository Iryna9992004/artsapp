import { Controller, Post, Req } from '@nestjs/common';
import { RegisterUsecase } from '../application/register.usecase';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUsecase: RegisterUsecase) {}

  @Post('register')
  async register(@Req() request: Request) {
    const userAgent = request.headers['user-agent'];
    return this.registerUsecase.exec(userAgent, request.body);
  }
}
