import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  isURL,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
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

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  itemsId: number[];
}
