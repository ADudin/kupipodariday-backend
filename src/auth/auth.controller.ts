import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { TUser } from 'src/users/types/user.type';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req): Promise<{ access_token: string }> {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  async create(@Body() createUserDto: CreateUserDto): Promise<TUser> {
    const { password, ...rest } = await this.usersService.createUser(createUserDto);
    return rest;
  }
}