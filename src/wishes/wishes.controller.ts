import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/createWish.dto';
import { Wish } from './entities/wish.entity';
import { IUserRequest } from 'src/users/types/user.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/updateWish.dto';
import { User } from 'src/users/entities/user.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    return this.wishesService.updateOne(id, updateWishDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeWish(
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ): Promise<Wish> {
    return this.wishesService.removeOne(id, req.user);
  }

  @Post(':id/copy')
  @UseGuards(JwtAuthGuard)
  async copyWish(
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    return this.wishesService.copyById(id, req.user);
  }
}
