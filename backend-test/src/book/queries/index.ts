import { Provider } from '@nestjs/common';
import { GetBooksHandler } from './get-books';

export * from './get-books';

export const QueryHandlers: Provider[] = [GetBooksHandler];
