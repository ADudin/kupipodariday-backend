import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { Offer } from 'src/offers/entities/offer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, Offer])],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}