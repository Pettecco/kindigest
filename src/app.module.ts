import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ImportsModule } from './imports/imports.module';
import { WordsModule } from './words/words.module';
import { BooksModule } from './books/books.module';
import { LearningModule } from './learning/learning.module';
import { DefinitionsModule } from './definitions/definitions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ImportsModule,
    WordsModule,
    BooksModule,
    LearningModule,
    DefinitionsModule,
  ],
})
export class AppModule {}
