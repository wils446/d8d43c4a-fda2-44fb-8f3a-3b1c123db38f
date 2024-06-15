import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BorrowBookDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  memberCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  bookCode: string;
}
