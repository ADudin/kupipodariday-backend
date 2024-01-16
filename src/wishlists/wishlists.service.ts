import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

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

  async create(createWishlistDto: CreateWishlistDto, owner: User): Promise<Wishlist> {
    const { name, description, image, itemsId } = createWishlistDto;
    const items = [];

    for (const itemId of itemsId) {
      items.push(await this.wishesService.findOne(itemId));
    }

    return this.wishlistsRepository.save({ name, description, image, items });
  }
}