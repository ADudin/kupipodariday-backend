import { Body, Controller, Post, Req } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWish.dto';
import { Wish } from './entities/wish.entity';
import { IUserRequest } from 'src/users/types/user.type';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  async create(@Body() createWishDto: CreateWishDto, @Req() req: IUserRequest): Promise<Wish> {
    return this.wishesService.create(createWishDto, req?.user);
  }
}