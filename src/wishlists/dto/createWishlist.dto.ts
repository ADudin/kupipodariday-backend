import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, {
    message: 'Название списка подарков должно содержать не менее 1 символа',
  })
  @MaxLength(250, {
    message: 'Название списка подарков должно содержать не более 250 символов',
  })
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Описание списка подарков должно содержать не менее 1 символа',
  })
  @MaxLength(1500, {
    message: 'Описание списка подарков должно содержать не более 1500 символов',
  })
  description: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  itemsId: number[];
}
