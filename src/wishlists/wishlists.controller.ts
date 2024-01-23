import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { IUserRequest } from 'src/users/types/user.type';
import { Wishlist } from './entities/wishlist.entity';

@Controller('wishlists')
export class WishlistsController {
  constructor (private readonly wishlistsService: WishlistsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserWishlists(@Req() req: IUserRequest): Promise<Wishlist[]> {
    return this.wishlistsService.findAll(req.user.id);
  }
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async createWishlist(@Body() createWishlistDto: CreateWishlistDto, @Req() req: IUserRequest): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getWishlistById(@Param('id') id: number): Promise<Wishlist> {
    return this.wishlistsService.findOne(id);
  }
}