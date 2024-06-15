import { Expose } from 'class-transformer';
import { BorrowedBook } from 'src/book/entities';
import { Base } from 'src/database/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Member extends Base {
  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ default: null })
  penalizedAt: Date;

  @OneToMany(() => BorrowedBook, (borrowed) => borrowed.member)
  borrowedBook: BorrowedBook[];

  @Expose()
  get borrowedCount(): number {
    return this.borrowedBook?.length || 0;
  }
}
