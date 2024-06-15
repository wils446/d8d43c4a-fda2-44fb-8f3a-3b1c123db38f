import { BorrowBookDto } from 'src/book/dtos/request';

export class BorrowBookCommand {
  constructor(public readonly borrowBookDto: BorrowBookDto) {}
}
