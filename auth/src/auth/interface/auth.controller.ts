import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { RegisterUsecase } from '../application/register.usecase';
import { Request, Response } from 'express';
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
  async register(@Req() request: Request, @Res() response: Response) {
    const userAgent = request.headers['user-agent'];
    const res = await this.registerUsecase.exec(userAgent, request.body);
    if (res) {
      response.cookie('accessToken', res.accessToken, {
        sameSite: false,
        secure: true,
        maxAge: 15 * 60 * 1000,
      });
      response.cookie('userAgentSession', userAgent, {
        maxAge: 120 * 60 * 1000,
        secure: true,
        sameSite: false,
      });
    }

    return response.json({ ...res.user });
  }

  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    const userAgent = request.headers['user-agent'];
    const res = await this.loginUsecase.exec(`${userAgent}`, request.body);
    if (res) {
      response.cookie('accessToken', res.accessToken, {
        sameSite: false,
        secure: true,
        maxAge: 15 * 60 * 1000,
      });
      response.cookie('userAgentSession', userAgent, {
        maxAge: 120 * 60 * 1000,
        secure: true,
        sameSite: false,
      });
    }

    return response.json({ ...res.user });
  }

  @Get('/refresh')
  async refresh(@Req() request: Request) {
    const userAgent = request.cookies['userAgentSession'];
    return this.refreshUsecase.execute(userAgent);
  }

  @Get('/logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    const userAgent = request.cookies['userAgentSession'];
    response.clearCookie('accessToken');
    response.clearCookie('userAgentSession');
    const res = await this.logoutUsecase.execute(userAgent);
    return response.json(res);
  }
}
