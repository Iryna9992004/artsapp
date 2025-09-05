import { Module } from '@nestjs/common';
import { AuthController } from './auth/interface/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
