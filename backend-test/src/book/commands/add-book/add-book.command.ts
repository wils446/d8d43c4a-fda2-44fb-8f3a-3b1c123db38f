import { AddBookDto } from 'src/book/dtos/request';

export class AddBookCommand {
  constructor(public readonly addBookDto: AddBookDto) {}
}
