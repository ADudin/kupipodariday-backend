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
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { IUserRequest } from 'src/users/types/user.type';
import { Wishlist } from './entities/wishlist.entity';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';

@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserWishlists(@Req() req: IUserRequest): Promise<Wishlist[]> {
    return this.wishlistsService.findAll(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Req() req: IUserRequest,
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getWishlistById(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateWishlist(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: IUserRequest,
  ): Promise<Wishlist> {
    return this.wishlistsService.update(id, updateWishlistDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeWishlist(
    @Param('id') id: number,
    @Req() req: IUserRequest,
  ): Promise<Wishlist> {
    return this.wishlistsService.removeOne(id, req.user);
  }
}
