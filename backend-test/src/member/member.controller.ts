import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddMemberCommand } from './commands';
import { AddMemberDto } from './dtos/request';
import { AddMemberResponseDto } from './dtos/response';
import { GetMembersQuery } from './queries';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(
    public readonly commandBus: CommandBus,
    public readonly queryBus: QueryBus,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'create member',
    type: AddMemberResponseDto,
  })
  @ApiBadRequestResponse({ description: 'validate error' })
  async addMember(@Body() bodyPayload: AddMemberDto) {
    return await this.commandBus.execute(
      new AddMemberCommand(bodyPayload.name),
    );
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'get all members' })
  async getMember() {
    return await this.queryBus.execute(new GetMembersQuery());
  }
}
