import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisdbService } from 'src/redisdb/redisdb.service';
import * as jwt from 'jsonwebtoken';
import config from 'src/shared/config';

@Injectable()
export class RefreshUsecase {
  constructor(private redisService: RedisdbService) {}

  async execute(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    let decodedToken: any;
    try {
      decodedToken = jwt.verify(refreshToken, config.jwt.refresh_secret);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!decodedToken || !decodedToken.id) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const { id, full_name, email } = decodedToken;

    // Verify that the token exists in Redis
    const storedToken = await this.redisService.getValue(`user:${id}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedException('Session expired or invalid');
    }

    const accessToken = jwt.sign(
      { id, full_name, email },
      config.jwt.access_secret,
      { expiresIn: '15m' },
    );
    const newRefreshToken = jwt.sign(
      { id, full_name, email },
      config.jwt.refresh_secret,
      { expiresIn: '2h' },
    );

    // Update refresh token in Redis using user ID
    await this.redisService.setValue(`user:${id}`, newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken, user: { id, full_name, email } };
  }
}
