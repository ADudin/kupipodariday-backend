import { IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1, {
    message: 'Название списка подарков должно содержать не менее 1 символа'
  })
  @MaxLength(250, {
    message: 'Название списка подарков должно содержать не более 250 символов'
  })
  name: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  itemsId: number[];
}