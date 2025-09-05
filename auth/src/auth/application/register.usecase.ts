import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryClickhouse } from '../infrastructure/repos/user.repository';
import { User } from '../domain/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from 'src/shared/config';
import { RedisdbService } from 'src/redisdb/redisdb.service';

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly userRepositoryClickhouse: UserRepositoryClickhouse,
    private readonly redisService: RedisdbService,
  ) {}

  async exec(userAgent: string, user: User) {
    const foundUser = await this.userRepositoryClickhouse.findByEmail(
      user.email,
    );
    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const pass = await bcrypt.hash(user.pass, 4);
    const createdUser = await this.userRepositoryClickhouse.create({
      ...user,
      pass,
    });

    const { id, full_name, email } = createdUser;
    const accessToken = jwt.sign(
      { id, full_name, email },
      config.jwt.access_secret,
    );
    const refreshToken = jwt.sign(
      { id, full_name, email },
      config.jwt.access_secret,
    );

    await this.redisService.setValue(userAgent, refreshToken);

    return { accessToken };
  }
}
