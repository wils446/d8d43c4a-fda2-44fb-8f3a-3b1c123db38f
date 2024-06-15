import { ReturnBookDto } from 'src/book/dtos/request';

export class ReturnBookCommand {
  constructor(public readonly returnBookDto: ReturnBookDto) {}
}
