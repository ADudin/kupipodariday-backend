import { BadRequestException, Injectable } from '@nestjs/common';
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
    const wishes = await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
    return wishes;
  }

  async findOne(id: number): Promise<Wish> {
    const wish = this.wishesRepository.findOne({
      where: {
        id,
      }
    });

    if(!wish) {
      throw new BadRequestException('Подарок не найден');
    }

    return wish;
  }
}