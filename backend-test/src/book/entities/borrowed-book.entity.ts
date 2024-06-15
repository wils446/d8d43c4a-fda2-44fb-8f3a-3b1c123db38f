import { Base } from 'src/database/base.entity';
import { Member } from 'src/member/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class BorrowedBook extends Base {
  @Column({ type: 'uuid' })
  bookId: string;

  @Column({ type: 'uuid' })
  memberId: string;

  @ManyToOne(() => Book, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @ManyToOne(() => Member, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
