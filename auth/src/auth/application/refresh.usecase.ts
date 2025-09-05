import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisdbService } from 'src/redisdb/redisdb.service';
import * as jwt from 'jsonwebtoken';
import config from 'src/shared/config';

@Injectable()
export class RefreshUsecase {
  constructor(private redisService: RedisdbService) {}

  async execute(ip: string) {
    const foundSession = await this.redisService.getValue(ip);
    if (!foundSession) {
      throw new UnauthorizedException('Session expired');
    }

    const decodedToken = jwt.verify(foundSession, config.jwt.refresh_secret);

    if (!decodedToken) {
      throw new UnauthorizedException('Session expired');
    }

    const accessToken = jwt.sign({ ...decodedToken }, config.jwt.access_secret);
    const refreshToken = jwt.sign(
      { ...decodedToken },
      config.jwt.access_secret,
    );

    await this.redisService.setValue(ip, refreshToken);

    return { accessToken };
  }
}
