import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/book/entities';
import { BookRepository } from 'src/book/repositories';
import { MoreThan } from 'typeorm';
import { GetBooksQuery } from './get-books.query';

@QueryHandler(GetBooksQuery)
export class GetBooksHandler implements IQueryHandler<GetBooksQuery> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(query: GetBooksQuery) {
    try {
      const books = await this.bookRepository.find({
        ...(query.available && { where: { stock: MoreThan(0) } }),
      });

      return books;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
