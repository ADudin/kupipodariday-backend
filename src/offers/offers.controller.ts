import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateOfferDto } from './dto/createOffer.dto';
import { IUserRequest } from 'src/users/types/user.type';
import { Offer } from './entities/offer.entity';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: IUserRequest,
  ): Promise<Record<string, never>> {
    await this.offersService.create(createOfferDto, req.user);
    return {};
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotHiddenOffers(): Promise<Offer[]> {
    return await this.offersService.findNotHiddenOffers();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOfferById(@Param('id') offerId: number): Promise<Offer> {
    return await this.offersService.findOne(offerId);
  }
}
