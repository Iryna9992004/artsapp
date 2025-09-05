import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { LoginUsecase } from './application/login.usecase';
import { RegisterUsecase } from './application/register.usecase';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';
import { UserRepositoryClickhouse } from './infrastructure/repos/user.repository';

@Module({
  controllers: [AuthController],
  providers: [LoginUsecase, RegisterUsecase, UserRepositoryClickhouse],
  imports: [ClickhouseModule],
})
export class AuthModule {}
