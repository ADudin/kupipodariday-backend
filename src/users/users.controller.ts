import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserRequest, TUser } from 'src/users/types/user.type';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findMe(@Req() req: IUserRequest): Promise<TUser> {
    const { password, ...user } = await req.user;
    return user;
  }
}
