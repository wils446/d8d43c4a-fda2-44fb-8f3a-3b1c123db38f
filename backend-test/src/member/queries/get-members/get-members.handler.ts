import { InternalServerErrorException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/entities';
import { MemberRepository } from 'src/member/repositories';
import { GetMembersQuery } from './get-members.query';

@QueryHandler(GetMembersQuery)
export class GetMembersHandler implements IQueryHandler<Member> {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute() {
    try {
      const members = await this.memberRepository.find({
        relations: { borrowedBook: true },
      });

      return {
        members: members.map((member) => {
          const { borrowedBook, ...memberData } = member;

          return {
            ...memberData,
            borrowedCount: member.borrowedCount,
          };
        }),
      };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
