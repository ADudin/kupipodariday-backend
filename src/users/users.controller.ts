import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUserRequest, TUser } from 'src/users/types/user.type';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FindUsersDto } from './dto/findUsers.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

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
  async findUserByName(@Param('username') username: string): Promise<TUser> {
    const { password, ...rest } = await this.usersService.findUserName(username);
    return rest;
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(@Req() req: IUserRequest, @Body() updateUserDto: UpdateUserDto): Promise<TUser> {
    return await this.usersService.updateUser(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  @UseGuards(JwtAuthGuard)
  async getOwnWishes(@Req() req: IUserRequest): Promise<Wish[]> {
    return this.usersService.findOwnWishes(req.user.id);
  }

  @Get(':username/wishes')
  @UseGuards(JwtAuthGuard)
  async getWishesByUsername(@Param('username') username: string ): Promise<Wish[]> {
    return this.usersService.findWishesByUsername(username);
  }

  @Post('find')
  @UseGuards(JwtAuthGuard)
  async findMany(@Body() findUsersDto: FindUsersDto): Promise<TUser[]> {
    return await this.usersService.findMany(findUsersDto.query);
  }
}
