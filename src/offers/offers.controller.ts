import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/createOffer.dto';
import { IUserRequest } from 'src/users/types/user.type';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createOfferDto: CreateOfferDto, @Req() req: IUserRequest): Promise<Record<string, never>> {
    await this.offersService.create(createOfferDto, req.user);
    return {};
  }
}