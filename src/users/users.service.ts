import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from 'src/hash/hash.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}
  
  async findUserName(userName: string): Promise<User> {
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

  async findUserEmail(userEmail: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        email: userEmail
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

  async findUserInfo(key: string | number, param: any): Promise<User> {
    return await this.usersRepository.findOneBy({ [key]: param });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const users = await this.usersRepository.findBy([
      { username: updateUserDto.username },
      { email: updateUserDto.email },
    ]);

    for (const user of users) {
      if (user.id !== userId) {
        throw new HttpException('Пользователь с таким именем или адресом электронной почты уже существует', HttpStatus.UNPROCESSABLE_ENTITY);
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashService.getHash(updateUserDto.password);
    }

    const currentUser = await this.findUserInfo('id', userId);

    Object.assign(currentUser, updateUserDto);
    return await this.usersRepository.save(currentUser);
  }
}