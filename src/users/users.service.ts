import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,
  ) {}
  
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new User();
    Object.assign(newUser, createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async findOne(key: string, param: any): Promise<User> {
    return await this.usersRepository.findOneBy({ [key]: param });
  }
}