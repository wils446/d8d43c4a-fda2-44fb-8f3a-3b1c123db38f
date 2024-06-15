import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MemberModule } from 'src/member/member.module';
import { BookController } from './book.controller';
import { CommandHandlers } from './commands';
import { QueryHandlers } from './queries';
import { BookRepository, BorrowedBookRepository } from './repositories';

@Module({
  imports: [CqrsModule, MemberModule],
  controllers: [BookController],
  providers: [
    BookRepository,
    BorrowedBookRepository,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class BookModule {}
