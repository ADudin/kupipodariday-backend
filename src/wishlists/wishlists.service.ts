import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { WishesService } from '../wishes/wishes.service';
import { TUser } from 'src/users/types/user.type';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = this.wishlistsRepository.findOne({
      where: {
        id,
      }
    });

    if(!wishlist) {
      throw new BadRequestException('Список подарков не найден');
    }

    return wishlist;
  }

  async create(createWishlistDto: CreateWishlistDto, user: TUser): Promise<Wishlist> {
    const { name, image, itemsId } = createWishlistDto;
    const wishes = [];

    for (const itemId of itemsId) {
      wishes.push((await this.wishesService.findOne(itemId)));
    }

    return this.wishlistsRepository.save({ name, image, items: wishes, owner: user });
  }
}