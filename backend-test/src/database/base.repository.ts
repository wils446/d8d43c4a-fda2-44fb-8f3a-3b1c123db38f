import { NotFoundException } from '@nestjs/common';
import {
  FindOneOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export type BaseRepository<T extends ObjectLiteral> = Repository<T> & {
  findOneOrThrow: (
    this: BaseRepository<T>,
    options: FindOneOptions<T>,
    errMessage?: string,
  ) => Promise<T>;
  findOneByOrThrow: (
    this: BaseRepository<T>,
    options: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    errMessage?: string,
  ) => Promise<T>;
};

export const generateCustomRepositoryMethods = <T>(): Pick<
  BaseRepository<T>,
  'findOneOrThrow' | 'findOneByOrThrow'
> => ({
  async findOneOrThrow(options, errMessage) {
    const data = await this.findOne(options);
    if (!data)
      throw new NotFoundException(errMessage ? errMessage : 'data not found');
    return data;
  },
  async findOneByOrThrow(options, errMessage) {
    const data = await this.findOneBy(options);
    if (!data)
      throw new NotFoundException(errMessage ? errMessage : 'data not found');
    return data;
  },
});
