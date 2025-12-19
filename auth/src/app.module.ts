import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PgModule } from './pg/pg.module';

@Module({
  controllers: [],
  providers: [],
  imports: [AuthModule, PgModule],
})
export class AppModule {}
