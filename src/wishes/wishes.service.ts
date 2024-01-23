import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/updateWish.dto';
import { TUser } from 'src/users/types/user.type';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: TUser): Promise<Record<string, never>> {
    const wish = new Wish();
    Object.assign(wish, createWishDto);
    wish.owner = owner;
    await this.wishesRepository.save(wish);
    return {};
  }

  async findLast(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        offers: true,
      },
    });

    if(!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.BAD_REQUEST);
    }

    return wish;
  }

  async updateOne(id: number, updateWishDto: UpdateWishDto, user: TUser): Promise<Record<string, never>> {
    const wish = await this.findOne(id);

    if (wish.owner.id !== user.id) {
      throw new HttpException('Подарок принадлежит другому пользователю', HttpStatus.FORBIDDEN);
    }

    if (wish.raised != 0.00) {
      throw new HttpException('Нельзя изменить данные о подарке, который поддержали другие пользователи', HttpStatus.FORBIDDEN);
    }

    await this.wishesRepository.update(id, updateWishDto);
    return {};
  }

  async removeOne(id: number, user: TUser): Promise<Wish> {
    const wishToRemove = await this.findOne(id);

    if (wishToRemove.owner.id !== user.id) {
      throw new HttpException('Подарок принадлежит другому пользователю', HttpStatus.FORBIDDEN);
    }

    if (wishToRemove.raised != 0.00) {
      throw new HttpException('Нельзя удалить подарок, который поддержали другие пользователи', HttpStatus.FORBIDDEN);
    }

    await this.wishesRepository.delete(id);
    
    return wishToRemove;
  }

  async copyById(wishId: number, user: TUser): Promise<Record<string, never>> {
    const wishToCopy = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: {  owner: true },
    });

    if (user.id === wishToCopy.owner.id) {
      throw new HttpException('Нельзя копировать свой подарок', HttpStatus.FORBIDDEN);
    }

    const createWishDto: CreateWishDto = {
      name: wishToCopy.name,
      link: wishToCopy.link,
      image: wishToCopy.image,
      price: wishToCopy.price,
      description: wishToCopy.description,
    }
    
    await this.create(createWishDto, user);
    await this.wishesRepository.increment({ id: wishId }, 'copied', 1);
    return {};
  }
}