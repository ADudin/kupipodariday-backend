import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Имя пользователя должно содержать не менее 2 символов',
  })
  @MaxLength(30, {
    message: 'Имя пользователя должно содержать не более 30 символов',
  })
  username: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Поле должно содержать не менее 2 символов',
  })
  @MaxLength(200, {
    message: 'Поле должно содержать не более 200 символов',
  })
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;


  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Пароль должен содержать не менее 2 символов',
  })
  password: string;
}