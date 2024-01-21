import { IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength } from "class-validator";

export class UpdateWishDto {
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Название подарка должно содержать не менее 1 символа',
  })
  @MaxLength(250, {
    message: 'Название подарка должно содержать не более 250 символов',
  })
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price: number;

  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Описание подарка должно содержать не менее 1 символа',
  })
  @MaxLength(1024, {
    message: 'Описание подарка должно содержать не более 1024 символов',
  })
  description: string;
}