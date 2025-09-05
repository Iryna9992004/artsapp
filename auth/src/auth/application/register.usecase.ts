import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryClickhouse } from '../infrastructure/repos/user.repository';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class RegisterUsecase {
  constructor(
    private readonly userRepositoryClickhouse: UserRepositoryClickhouse,
  ) {}

  async exec(user: User) {
    const foundUser = await this.userRepositoryClickhouse.findByEmail(
      user.email,
    );
    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const createdUser = await this.userRepositoryClickhouse.create(user);
    return createdUser;
  }
}
