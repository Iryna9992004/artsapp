import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { LoginUsecase } from './application/login.usecase';
import { RegisterUsecase } from './application/register.usecase';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';
import { UserRepositoryClickhouse } from './infrastructure/repos/user.repository';
import { RedisdbModule } from 'src/redisdb/redisdb.module';
import { RefreshUsecase } from './application/refresh.usecase';
import { LogoutUsecase } from './application/logout.usecase';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUsecase,
    RegisterUsecase,
    UserRepositoryClickhouse,
    RefreshUsecase,
    LogoutUsecase,
  ],
  imports: [ClickhouseModule, RedisdbModule],
})
export class AuthModule {}
