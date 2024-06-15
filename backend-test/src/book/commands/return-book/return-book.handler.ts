import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, BorrowedBook } from 'src/book/entities';
import { BookRepository, BorrowedBookRepository } from 'src/book/repositories';
import { dateDiff } from 'src/commons/utils';
import { Member } from 'src/member/entities';
import { MemberRepository } from 'src/member/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { ReturnBookCommand } from './return-book.command';

@CommandHandler(ReturnBookCommand)
export class ReturnBookHandler implements ICommandHandler<ReturnBookCommand> {
  private queryRunner: QueryRunner;

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: BookRepository,
    @InjectRepository(Member)
    private readonly memberRepository: MemberRepository,
    @InjectRepository(BorrowedBook)
    private readonly borrowedBookRepository: BorrowedBookRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(command: ReturnBookCommand) {
    this.queryRunner = this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();

    const date = new Date(command.returnBookDto.date) || new Date();

    const { book, borrowedBook, member } = await this.getBorrowedBook(
      command.returnBookDto.bookCode,
      command.returnBookDto.memberCode,
    );

    const borrowedDate = dateDiff(borrowedBook.createdAt, date);

    try {
      if (borrowedDate > 7) await this.penalizeMember(member, date);
      await this.updateBookStock(book);
      await this.deleteBorrowedBook(borrowedBook);
      await this.queryRunner.commitTransaction();
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async updateBookStock(book: Book) {
    try {
      book.stock += 1;
      await this.queryRunner.manager.save(book);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async deleteBorrowedBook(borrowedBook: BorrowedBook) {
    const result = await this.queryRunner.manager.delete(
      BorrowedBook,
      borrowedBook.id,
    );
    if (result.affected === 0) {
      throw new NotFoundException(
        `borrowed book with id ${borrowedBook.id} is not found`,
      );
    }
  }

  async getBorrowedBook(bookCode: string, memberCode: string) {
    const member = await this.memberRepository.findOneByOrThrow(
      {
        code: memberCode,
      },
      `Member with code ${memberCode} is not found`,
    );

    const book = await this.bookRepository.findOneByOrThrow(
      { code: bookCode },
      `Book with code ${bookCode} is not found`,
    );

    const borrowedBook = await this.borrowedBookRepository.findOneByOrThrow(
      { bookId: book.id, memberId: member.id },
      `Book is not borrowed`,
    );

    return { member, book, borrowedBook };
  }

  async penalizeMember(member: Member, date: Date) {
    try {
      member.penalizedAt = date;
      await this.queryRunner.manager.save(member);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
