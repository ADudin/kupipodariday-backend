import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  // async validateUser(username: string, password: string) {
  //   const user = await this.usersService.findUserInfo('username', username);
    
  //   if (!user) {
  //     throw new UnauthorizedException('Имя пользователя или пароль не совпадают');
  //   }

  //   const isCorrect = this.hashService.compare(password, user.password);

  //   if (!isCorrect) {
  //     throw new UnauthorizedException('Имя пользователя или пароль не совпадают');
  //   }

  //   return user;
  // }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserInfoWithPassword(username);
    
    if (!user) {
      throw new UnauthorizedException('Имя пользователя или пароль не совпадают');
    }

    const isCorrect = this.hashService.compare(password, user.password);

    if (!isCorrect) {
      throw new UnauthorizedException('Имя пользователя или пароль не совпадают');
    }

    return user;
  }
}