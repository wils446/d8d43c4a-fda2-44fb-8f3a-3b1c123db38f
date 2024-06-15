import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Book, BorrowedBook } from 'src/book/entities';
import { BookRepository, BorrowedBookRepository } from 'src/book/repositories';
import { dateDiff } from 'src/commons/utils';
import { Member } from 'src/member/entities';
import { MemberRepository } from 'src/member/repositories';
import { DataSource, QueryRunner } from 'typeorm';
import { BorrowBookCommand } from './borrow-book.command';

@CommandHandler(BorrowBookCommand)
export class BorrowBookHandler implements ICommandHandler<BorrowBookCommand> {
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

  async execute(command: BorrowBookCommand): Promise<any> {
    this.queryRunner = this.dataSource.createQueryRunner();
    this.queryRunner.connect();
    this.queryRunner.startTransaction();

    const member = await this.validateMember(command.borrowBookDto.memberCode);
    const book = await this.validateBook(command.borrowBookDto.bookCode);

    try {
      await this.createBorrowedBook(book, member);
      await this.updateBookStock(book);
      await this.queryRunner.commitTransaction();
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }

  async validateBook(bookCode: string) {
    const book = await this.bookRepository.findOneByOrThrow(
      { code: bookCode },
      `Book with code ${bookCode} is not found`,
    );

    if (book.stock === 0) throw new BadRequestException('out of stock');

    return book;
  }

  async validateMember(memberCode: string) {
    const member = await this.memberRepository.findOneOrThrow(
      { where: { code: memberCode }, relations: { borrowedBook: true } },
      `Member with code ${memberCode} is not found`,
    );

    if (member.borrowedCount >= 2)
      throw new ForbiddenException('Member already borrowed 2 books');

    if (!member.penalizedAt) return member;

    const dateDiffPenalized = dateDiff(member.penalizedAt, new Date());

    if (dateDiffPenalized <= 3)
      throw new ForbiddenException('Member is penalized');

    return member;
  }

  async createBorrowedBook(book: Book, member: Member) {
    const borrowedBook = await this.borrowedBookRepository.create({
      book,
      member,
    });

    try {
      await this.queryRunner.manager.save(borrowedBook);
      return borrowedBook;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async updateBookStock(book: Book) {
    try {
      book.stock -= 1;
      await this.queryRunner.manager.save(book);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
