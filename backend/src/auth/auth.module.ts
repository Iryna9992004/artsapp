import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { LoginUsecase } from './application/login.usecase';
import { RegisterUsecase } from './application/register.usecase';
import { RedisdbModule } from 'src/redisdb/redisdb.module';
import { RefreshUsecase } from './application/refresh.usecase';
import { LogoutUsecase } from './application/logout.usecase';
import { PgModule } from 'src/pg/pg.module';
import { UserRepositoryPostgres } from './infrastructure/repos/user.repository';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUsecase,
    RegisterUsecase,
    UserRepositoryPostgres,
    RefreshUsecase,
    LogoutUsecase,
  ],
  imports: [RedisdbModule, PgModule],
})
export class AuthModule {}
