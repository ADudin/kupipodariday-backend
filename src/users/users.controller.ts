import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { TUser } from 'src/users/types/user.type';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // перенести в модуль авторизации и убрать пароль
  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('me')
  async getOneMe(@Req() req): Promise<TUser> {
    const { password, ...rest } = await this.usersService.findOne(
      'id',
      req.user.id
    );
    return rest;
  }
}
