import { Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  BaseRepository,
  generateCustomRepositoryMethods,
} from 'src/database/base.repository';
import { DataSource } from 'typeorm';
import { Book } from '../entities';

export type BookRepository = BaseRepository<Book>;

const customBookRepositoryMethods = generateCustomRepositoryMethods<Book>();

export const BookRepository: Provider = {
  provide: getRepositoryToken(Book),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Book).extend(customBookRepositoryMethods),
};
