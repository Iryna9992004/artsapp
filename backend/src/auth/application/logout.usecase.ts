import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisdbService } from 'src/redisdb/redisdb.service';
import * as jwt from 'jsonwebtoken';
import config from 'src/shared/config';

@Injectable()
export class LogoutUsecase {
  constructor(private readonly redisService: RedisdbService) {}

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

    const { id } = decodedToken;

    // Verify that the token exists in Redis before deleting
    const storedToken = await this.redisService.getValue(`user:${id}`);
    if (storedToken && storedToken === refreshToken) {
      await this.redisService.deleteValue(`user:${id}`);
    }

    return { message: 'User logged out successfully' };
  }
}
