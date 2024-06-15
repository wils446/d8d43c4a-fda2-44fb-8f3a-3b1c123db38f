import { Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  BaseRepository,
  generateCustomRepositoryMethods,
} from 'src/database/base.repository';
import { DataSource } from 'typeorm';
import { BorrowedBook } from '../entities';

export type BorrowedBookRepository = BaseRepository<BorrowedBook>;

const customBorrowedBookMethods =
  generateCustomRepositoryMethods<BorrowedBook>();

export const BorrowedBookRepository: Provider = {
  provide: getRepositoryToken(BorrowedBook),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(BorrowedBook).extend(customBorrowedBookMethods),
};
