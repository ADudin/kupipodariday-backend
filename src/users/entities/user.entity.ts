import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/utils/base.entity';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { hash } from 'bcrypt';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Имя пользователя должно содержать не менее 2 символов',
  })
  @MaxLength(30, {
    message: 'Имя пользователя должно содержать не более 30 символов',
  })
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @IsOptional()
  @MinLength(2, {
    message: 'Поле должно содержать не менее 2 символов',
  })
  @MaxLength(200, {
    message: 'Поле должно содержать не более 200 символов',
  })
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  @Column({ unique: true })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Column({ select: false })
  @IsString()
  @IsNotEmpty()
  @MinLength(7, {
    message: 'Пароль должен содержать не менее 7 символов',
  })
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // Добавить offers и wishlists

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}