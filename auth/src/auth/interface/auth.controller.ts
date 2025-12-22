import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { RegisterUsecase } from '../application/register.usecase';
import { Request, Response } from 'express';
import { LoginUsecase } from '../application/login.usecase';
import { RefreshUsecase } from '../application/refresh.usecase';
import { LogoutUsecase } from '../application/logout.usecase';
import * as uuid from 'uuid';

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
    const userSessionId = uuid.v4();
    const res = await this.registerUsecase.exec(userSessionId, request.body);
    return response.json({ ...res.user, userSessionId });
  }

  @Post('login')
  async login(@Req() request: Request, @Res() response: Response) {
    const userSessionId = uuid.v4();
    const res = await this.loginUsecase.exec(`${userSessionId}`, request.body);
    return response.json({ ...res.user, userSessionId });
  }

  @Get('/refresh/:userSessionId')
  async refresh(@Param('userSessionId') userSessionId: string) {
    return this.refreshUsecase.execute(userSessionId);
  }

  @Get('/logout/:userSessionId')
  async logout(
    @Param('userSessionId') userSessionId: string,
    @Res() response: Response,
  ) {
    console.log('use', userSessionId);
    const res = await this.logoutUsecase.execute(userSessionId);
    return response.json(res);
  }
}
