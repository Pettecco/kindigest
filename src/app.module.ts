import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DocfyModule } from 'nestjs-docfy';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DocfyModule.forRoot({ strict: false }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
