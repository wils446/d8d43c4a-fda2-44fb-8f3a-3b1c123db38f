import { Base } from 'src/database/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Book extends Base {
  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;
}
