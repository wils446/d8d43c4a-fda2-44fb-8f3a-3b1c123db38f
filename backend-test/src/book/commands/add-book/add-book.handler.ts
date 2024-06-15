import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/book/entities';
import { BookRepository } from 'src/book/repositories';
import { AddBookCommand } from './add-book.command';

@CommandHandler(AddBookCommand)
export class AddBookHandler implements ICommandHandler<AddBookCommand> {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: BookRepository,
  ) {}

  async execute(command: AddBookCommand) {
    const book = await this.bookRepository.create({
      ...command.addBookDto,
    });

    try {
      await this.bookRepository.save(book);
      return book;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
