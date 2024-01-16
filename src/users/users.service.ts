import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { HashService } from 'src/hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}
  
  async findUserName(userName: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        username: userName
      }
    });
  }

  async findUserEmail(userEmail: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email: userEmail
      }
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userName = await this.findUserName(createUserDto.username);
    const userEmail = await this.findUserEmail(createUserDto.email);

    if (userName !== null) {
      throw new ForbiddenException('Пользователь с таким именем уже существует');
    }

    if (userEmail !== null) {
      throw new ForbiddenException('Пользователь с таким адресом электронной почты уже существует');
    }

    createUserDto.password = this.hashService.getHash(createUserDto?.password);
    const user = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(user);
  }

  async findUserInfo(key: string | number, param: any): Promise<User> {
    return await this.usersRepository.findOneBy({ [key]: param });
  }

  // async findOne(key: string, param: any): Promise<User> {
  //   return await this.usersRepository.findOneBy({ [key]: param });
  // }
}