import { Body, Controller, Post, Req, Res } from '@nestjs/common';
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
    const res = await this.registerUsecase.exec(request.body);
    return response.json(res);
  }

  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    const res = await this.loginUsecase.exec(request.body);
    return response.json(res);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.refreshUsecase.execute(refreshToken);
  }

  @Post('logout')
  async logout(
    @Body('refreshToken') refreshToken: string,
    @Res() response: Response,
  ) {
    const res = await this.logoutUsecase.execute(refreshToken);
    return response.json(res);
  }
}
