import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers } from './commands';
import { MemberController } from './member.controller';
import { QueryHandlers } from './queries';
import { MemberRepository } from './repositories';

@Module({
  imports: [CqrsModule],
  controllers: [MemberController],
  providers: [MemberRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [MemberRepository],
})
export class MemberModule {}
