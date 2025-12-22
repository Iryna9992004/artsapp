import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisdbService } from 'src/redisdb/redisdb.service';
import * as jwt from 'jsonwebtoken';
import config from 'src/shared/config';

@Injectable()
export class RefreshUsecase {
  constructor(private redisService: RedisdbService) {}

  async execute(userSessionId: string) {
    const foundSession = await this.redisService.getValue(userSessionId);
    if (!foundSession) {
      throw new UnauthorizedException('Session expired');
    }

    const decodedToken = jwt.verify(foundSession, config.jwt.refresh_secret);

    if (!decodedToken) {
      throw new UnauthorizedException('Session expired');
    }

    const { id, full_name, email } = decodedToken;

    const accessToken = jwt.sign(
      { id, full_name, email },
      config.jwt.access_secret,
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
      { id, full_name, email },
      config.jwt.refresh_secret,
      { expiresIn: '2h' },
    );

    await this.redisService.setValue(userSessionId, refreshToken);

    return { accessToken, userSessionId, user: { id, full_name, email } };
  }
}
