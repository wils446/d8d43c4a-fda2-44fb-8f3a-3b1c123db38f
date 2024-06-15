import { Provider } from '@nestjs/common';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import {
  BaseRepository,
  generateCustomRepositoryMethods,
} from 'src/database/base.repository';
import { DataSource } from 'typeorm';
import { Member } from '../entities';

export type MemberRepository = BaseRepository<Member>;

const customMemberRepositoryMethods = generateCustomRepositoryMethods<Member>();

export const MemberRepository: Provider = {
  provide: getRepositoryToken(Member),
  inject: [getDataSourceToken()],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(Member).extend(customMemberRepositoryMethods),
};
