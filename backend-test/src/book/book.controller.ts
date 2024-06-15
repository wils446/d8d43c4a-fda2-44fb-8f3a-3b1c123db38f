import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { AddBookCommand, BorrowBookCommand } from './commands';
import { ReturnBookCommand } from './commands/return-book';
import { AddBookDto, BorrowBookDto, ReturnBookDto } from './dtos/request';
import { AddbookResponseDto } from './dtos/response';
import { GetBooksQuery } from './queries';

@Controller('books')
export class BookController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'book created',
    type: AddbookResponseDto,
  })
  async addBook(@Body() bodyPayload: AddBookDto) {
    return await this.commandBus.execute(new AddBookCommand(bodyPayload));
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'available',
    description: 'set true to only show available books',
    type: Boolean,
    required: false,
  })
  @ApiOkResponse({ description: 'return books' })
  async getBooks(@Query('available') available: boolean) {
    return await this.queryBus.execute(new GetBooksQuery(available));
  }

  @Post('/borrow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'book borrowed' })
  @ApiNotFoundResponse({
    description: 'member/book is not found',
  })
  @ApiForbiddenResponse({
    description: 'member is penalized or member already borrowed 2 books',
  })
  @ApiBadRequestResponse({
    description: 'body validate error or book is out of stock',
  })
  async borrowBook(@Body() bodyPayload: BorrowBookDto) {
    return await this.commandBus.execute(new BorrowBookCommand(bodyPayload));
  }

  @Delete('/borrow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'book returned' })
  @ApiNotFoundResponse({
    description: 'member/book is not found or book is not borrowed',
  })
  async returnBook(@Body() bodyPayload: ReturnBookDto) {
    return await this.commandBus.execute(new ReturnBookCommand(bodyPayload));
  }
}
