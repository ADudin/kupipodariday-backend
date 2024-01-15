import { IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength, Min, MinLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/utils/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Wish extends BaseEntity {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Название подарка должно содержать не менее 1 символа',
  })
  @MaxLength(250, {
    message: 'Название подарка должно содержать не более 250 символов',
  })
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  @Min(1)
  price: number;

  @Column({ type: 'decimal', scale: 2 })
  @IsNumber()
  @Min(1)
  raised: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(1, {
    message: 'Описание подарка должно содержать не менее 1 символа',
  })
  @MaxLength(1024, {
    message: 'Описание подарка должно содержать не более 1024 символов',
  })
  description: string;

  @Column({ type: 'decimal', scale: 0, default: 0})
  @IsNumber()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinColumn({ name: 'user_id' })
  owner: User;

  // Добавить offers
}