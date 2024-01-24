import { User } from 'src/users/entities/user.entity';
import { Request as IRequest } from 'express';

export type TUser = Omit<User, 'password' | 'hashPassword'>;

export interface IUserRequest extends IRequest {
  user: User;
}
