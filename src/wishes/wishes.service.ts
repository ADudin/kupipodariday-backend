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
    return await this.wishesRepository.save({ ...createWishDto, owner });
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