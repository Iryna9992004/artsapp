import { Controller, Get, Post, Req } from '@nestjs/common';
import { RegisterUsecase } from '../application/register.usecase';
import { Request } from 'express';
import { LoginUsecase } from '../application/login.usecase';
import { RefreshUsecase } from '../application/refresh.usecase';
import { LogoutUsecase } from '../application/logout.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUsecase: RegisterUsecase,
    private readonly loginUsecase: LoginUsecase,
    private readonly refreshUsecase: RefreshUsecase,
    private readonly logoutUsecase: LogoutUsecase,
  ) {}

  @Post('register')
  async register(@Req() request: Request) {
    const ip = request.connection.remoteAddress;
    return this.registerUsecase.exec(ip, request.body);
  }

  @Post('login')
  async login(@Req() request: Request) {
    const ip = request.connection.remoteAddress;
    return this.loginUsecase.exec(ip, request.body);
  }

  @Get('/refresh')
  async refresh(@Req() request: Request) {
    const ip = request.connection.remoteAddress;
    return this.refreshUsecase.execute(ip);
  }

  @Get('/logout')
  async logout(@Req() request: Request) {
    const ip = request.connection.remoteAddress;
    return this.logoutUsecase.execute(ip);
  }
}
