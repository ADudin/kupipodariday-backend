import { IsBoolean, IsNumber } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { TUser } from 'src/users/types/user.type';
import { BaseEntity } from 'src/utils/base.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Offer extends BaseEntity {
  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  amount: number;
  
  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  @ManyToOne(() => User, (user) => user.offers)
  user: TUser;
}