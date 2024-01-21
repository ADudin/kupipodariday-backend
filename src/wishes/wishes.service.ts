import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/createWish.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, owner: User): Promise<Wish> {
    const wish = new Wish();
    Object.assign(wish, createWishDto);
    wish.owner = owner;
    return await this.wishesRepository.save(wish);
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
    const wish = this.wishesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    if(!wish) {
      throw new HttpException('Подарок не найден', HttpStatus.BAD_REQUEST);
    }

    return wish;
  }
}