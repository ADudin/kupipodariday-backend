import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from 'src/hash/hash.service';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Wish } from 'src/wishes/entities/wish.entity';
import { TUser } from './types/user.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly hashService: HashService,
  ) {}

  async findUserInfo(key: string | number, param: any): Promise<TUser> {
    return await this.usersRepository.findOneBy({ [key]: param });
  }

  async findUserInfoWithPassword(username: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.username = :username', {username})
      .addSelect(['user.password'])
      .getOne();

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND); 
    }

    return user;
  }
  
  async findUserName(userName: string): Promise<TUser> {
    const user = await this.usersRepository.findOne({
      where: {
        username: userName
      },
    });

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userName = await this.usersRepository.findOne({
      where: {
        username: createUserDto.username
      },
    });
    const userEmail = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email
      },
    });

    if (userName !== null) {
      throw new HttpException('Пользователь с таким именем уже существует', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    if (userEmail !== null) {
      throw new HttpException('Пользователь с таким адресом электронной почты уже существует', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    createUserDto.password = this.hashService.getHash(createUserDto?.password);
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const usersWithSameUsername = await this.usersRepository.find({
      where: {
        username: updateUserDto.username,
      },
    });

    for (const user of usersWithSameUsername) {
      if (user.username === updateUserDto.username && user.id !== userId) {
        throw new HttpException('Пользователь с таким именем уже существует', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    const usersWithSameEmail = await this.usersRepository.find({
      where: {
        email: updateUserDto.email,
      },
    });

    for (const user of usersWithSameEmail) {
      if (user.email === updateUserDto.email && user.id !== userId) {
        throw new HttpException('Пользователь с таким адресом электронной почты уже существует', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashService.getHash(updateUserDto.password);
    }

    const currentUser = await this.findUserInfo('id', userId);

    Object.assign(currentUser, updateUserDto);
    return await this.usersRepository.save(currentUser);
  }

  async findOwnWishes(userId: number): Promise<Wish[]> {
    return await this.wishesRepository.findBy({
      owner: { id: userId },
    });
  }

  async findWishesByUsername(username: string): Promise<Wish[]> {
    return await this.wishesRepository.findBy({
      owner: {username: username},
    });
  }

  async findMany(query: string): Promise<TUser[]> {
    return await this.usersRepository.findBy([
      { username: Like(`%${query}%`) },
      { email: Like(`%${query}%`) },
    ]);
  }
}