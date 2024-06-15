import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { dbConfig } from './commons/configs';
import { IsUniqueConstraint } from './commons/validators';
import { DatabaseModule } from './database/database.module';
import { MemberModule } from './member/member.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [dbConfig], isGlobal: true }),
    BookModule,
    MemberModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [IsUniqueConstraint],
})
export class AppModule {}
