import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import { RedisdbService } from 'src/redisdb/redisdb.service';
import config from 'src/shared/config';
import { UserRepositoryPostgres } from '../infrastructure/repos/user.repository';

@Injectable()
export class LoginUsecase {
  constructor(
    private readonly userRepositoryPostgres: UserRepositoryPostgres,
    private readonly redisService: RedisdbService,
  ) {}

  async exec(userAgent: string, user: User) {
    const foundUser = await this.userRepositoryPostgres.findByEmail(
      user.email,
    );

    if (!foundUser) {
      throw new BadRequestException('User with this email does not exist');
    }

    const passwordMatch = await bcrypt.compare(user.pass, foundUser.pass);

    if (!passwordMatch) {
      throw new BadRequestException('Wrong password');
    }

    const { id, full_name, email } = foundUser;
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

    await this.redisService.setValue(userAgent, refreshToken);
    return { accessToken, user: { id, email, full_name } };
  }
}
