import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWish.dto';
import { Wish } from './entities/wish.entity';
import { IUserRequest } from 'src/users/types/user.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createWishDto: CreateWishDto, @Req() req: IUserRequest): Promise<Record<string, never>> {
    await this.wishesService.create(createWishDto, req.user);
    return {};
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.findLast();
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return this.wishesService.findTop();
  }

  @Get(':id')
  async getWishById(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }
}