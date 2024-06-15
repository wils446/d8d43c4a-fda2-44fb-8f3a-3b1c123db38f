import { Provider } from '@nestjs/common';

import { AddBookHandler } from './add-book';
import { BorrowBookHandler } from './borrow-book';
import { ReturnBookHandler } from './return-book';

export * from './add-book';
export * from './borrow-book';
export * from './return-book';

export const CommandHandlers: Provider[] = [
  AddBookHandler,
  BorrowBookHandler,
  ReturnBookHandler,
];
