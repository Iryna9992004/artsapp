import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import config from 'src/shared/config';
import { RedisdbService } from 'src/redisdb/redisdb.service';
import { UserRepositoryPostgres } from '../infrastructure/repos/user.repository';

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly userRepositoryPostgres: UserRepositoryPostgres,
    private readonly redisService: RedisdbService,
  ) {}

  async exec(user: User) {
    const foundUser = await this.userRepositoryPostgres.findByEmail(user.email);
    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const pass = await bcrypt.hash(user.pass, 4);
    const createdUser = await this.userRepositoryPostgres.create({
      ...user,
      pass,
    });

    const { id, full_name, email } = createdUser;
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

    // Use user ID as key in Redis instead of session ID
    await this.redisService.setValue(`user:${id}`, refreshToken);

    return { accessToken, refreshToken, user: createdUser };
  }
}
