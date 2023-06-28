import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return await this.usersService.findOne(email, password);
  }

  async login(user: any) {
    try {
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        username: user.username,
      };
      return {
        ...payload,
        token: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new Error(`Error logging in ${error} user ${error.message}`);
    }
  }

  public async getAuthenticatedUser(
    email: string,
    password: string,
    newPassWord: string,
  ) {
    try {
      const user = await this.usersService.findUserByEmail(email);

      if (!user) {
        return;
      }

      // if (user.provider !== Providers.Local) {
      //   throw new SocialProvider();
      // }
      const passwordMatch = await bcrypt.compare(newPassWord, password);

      if (!passwordMatch) {
        // throw new InvalidCredentials();
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(user: any, body: any) {
    const authUser = await this.getAuthenticatedUser(
      user.email,
      user.password,
      body.newPassword,
    );
    if (user.newPassword === user.password) {
      throw new BadRequestException(`New password cannot be same as old`);
    }

    if (authUser) {
      this.usersService.update(user.id, {
        password: await bcrypt.hash(body.newPassword, 10),
      });
      return {
        success: true,
        message: 'Password changed',
      };
    }
  }
}
