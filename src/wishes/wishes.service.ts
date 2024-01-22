import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishDto } from './dto/updateWish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Record<string, never>> {
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

  async updateOne(id: number, updateWishDto: UpdateWishDto, user: User): Promise<Record<string, never>> {
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
}