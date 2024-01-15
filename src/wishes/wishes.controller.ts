import { Body, Controller, Post, Req } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWish.dto';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  //  Проверить передачу данных о владельце
  @Post()
  async createWish(@Body() createWishDto: CreateWishDto, @Req() req: any): Promise<Wish> {
    return this.wishesService.createWish(createWishDto, req?.user);
  }
}