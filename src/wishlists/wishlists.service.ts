import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/createWishlist.dto';
import { TUser } from 'src/users/types/user.type';
import { UpdateWishlistDto } from './dto/updateWishlist.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async findAll(userId: number): Promise<Wishlist[]> {
    return await this.wishlistsRepository.find({
      where: {
        owner: {
          id: userId,
        },
      },
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: {
        id,
      },
      relations: {
        items: true,
        owner: true,
      },
    });

    if (!wishlist) {
      throw new BadRequestException('Список подарков не найден');
    }

    return wishlist;
  }

  async create(
    createWishlistDto: CreateWishlistDto,
    user: TUser,
  ): Promise<Wishlist> {
    const { name, image, itemsId } = createWishlistDto;

    const wishes = await this.wishesRepository.findBy({ id: In(itemsId) });

    return this.wishlistsRepository.save({
      name,
      image,
      items: wishes,
      owner: user,
    });
  }

  async update(
    wishlistId: number,
    updateWishlistDto: UpdateWishlistDto,
    user: TUser,
  ): Promise<Wishlist> {
    const { itemsId, ...wishlist } = updateWishlistDto;
    const wishlistToUpdate = await this.findOne(wishlistId);

    if (!itemsId) {
      const wishes = wishlistToUpdate.items;
      console.log(wishes);
      wishlist['items'] = wishes;
    }

    if (wishlistToUpdate.owner.id !== user.id) {
      throw new HttpException(
        'Список подарков принадлежит другому пользователю',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishlistsRepository.update(
      { id: wishlistId, owner: { id: user.id } },
      wishlist,
    );

    return this.findOne(wishlistId);
  }

  async removeOne(wishlistId: number, user: TUser): Promise<Wishlist> {
    const wishlistToRemove = await this.findOne(wishlistId);

    if (wishlistToRemove.owner.id !== user.id) {
      throw new HttpException(
        'Список подарков принадлежит другому пользователю',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.wishlistsRepository.delete(wishlistId);
    return wishlistToRemove;
  }
}
