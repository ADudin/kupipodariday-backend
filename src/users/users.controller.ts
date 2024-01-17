import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserRequest, TUser } from 'src/users/types/user.type';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findMe(@Req() req: IUserRequest): Promise<TUser> {
    const { password, ...rest } = await req.user;
    return rest;
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  async findUserByName(@Param('username') username) {
    const { password, ...rest } = await this.usersService.findUserName(username);

    return rest;
  }
}
