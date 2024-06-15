import { IsDateString, IsOptional } from 'class-validator';
import { BorrowBookDto } from './borrow-book.dto';

export class ReturnBookDto extends BorrowBookDto {
  @IsOptional()
  @IsDateString()
  date: Date;
}
