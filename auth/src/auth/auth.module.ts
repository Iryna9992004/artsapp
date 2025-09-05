import { Module } from '@nestjs/common';
import { AuthController } from './interface/auth.controller';
import { LoginUsecase } from './application/login.usecase';
import { RegisterUsecase } from './application/register.usecase';
import { ClickHouseModule } from '@depyronick/nestjs-clickhouse';

@Module({
  controllers: [AuthController],
  providers: [LoginUsecase, RegisterUsecase],
  imports: [ClickHouseModule],
})
export class AppModule {}
