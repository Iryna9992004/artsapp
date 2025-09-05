import { Controller, Post, Req } from '@nestjs/common';
import { RegisterUsecase } from '../application/register.usecase';
import { Request } from 'express';
import { LoginUsecase } from '../application/login.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUsecase: RegisterUsecase,
    private readonly loginUsecase: LoginUsecase,
  ) {}

  @Post('register')
  async register(@Req() request: Request) {
    const userAgent = request.headers['user-agent'];
    return this.registerUsecase.exec(userAgent, request.body);
  }

  @Post('login')
  async login(@Req() request: Request) {
    const userAgent = request.headers['user-agent'];
    return this.loginUsecase.exec(userAgent, request.body);
  }
}
