import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/createOffer.dto';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Record<string, never>> {
    const offer = new Offer();
    const wish = await this.wishRepository.findOne({
      where: {
        id: createOfferDto.itemId,
      },
      relations: {
        owner: true,
      },
    })
    
    if (user.id === wish.owner.id) {
      throw new HttpException('Нельзя вносить деньги на собственные подарки', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (wish.price - wish.raised < createOfferDto.amount) {
      throw new HttpException('Сумма собранных средств не может превышать стоимость подарка', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const { itemId, ...rest } = createOfferDto;
    Object.assign(offer, rest);
    offer.item = wish;
    offer.user = user;
    await this.offersRepository.save(offer);
    await this.wishRepository.increment({ id: wish.id }, 'raised', createOfferDto.amount);
    return {};
  }

  async findNotHiddenOffers(): Promise<Offer[]> {
    return await this.offersRepository.find({
      where: {
        hidden: false,
      },
      relations: {
        item: true,
        user: true,
      },
    });
  }

  async findOne(offerId: number): Promise<Offer> {
    return await this.offersRepository.findOne({
      where: {
        id: offerId,
      },
      relations: {
        item: true,
        user: true,
      },
    });
  }
}