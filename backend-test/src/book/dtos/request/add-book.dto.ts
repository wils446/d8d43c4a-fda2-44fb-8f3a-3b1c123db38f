import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsUnique } from 'src/commons/decorators';

export class AddBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUnique({ tableName: 'book', column: 'code' })
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  stock: number;
}
