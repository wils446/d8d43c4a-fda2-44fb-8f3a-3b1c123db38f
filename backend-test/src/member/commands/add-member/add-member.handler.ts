import { InternalServerErrorException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/member/entities';
import { MemberRepository } from 'src/member/repositories';
import { AddMemberCommand } from './add-member.command';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand> {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: MemberRepository,
  ) {}

  async execute(command: AddMemberCommand) {
    const code = await this.generateMemberCode();
    const member = await this.memberRepository.create({
      name: command.name,
      code,
    });

    try {
      await this.memberRepository.save(member);
      return member;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async generateMemberCode() {
    const memberCount = (await this.memberRepository.count()) + 1;
    const pad = '000';

    return (
      'M' +
      pad.substring(0, pad.length - (memberCount + '').length) +
      (memberCount + '')
    );
  }
}
