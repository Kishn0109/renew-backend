import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    private usersService: userService,
    private jwtService: JwtService,
  ) {}
  async signIn(email: string, password: string): Promise<any> {
    const payload = { sub: email, username: password };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (user && isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async getUser(email: string): Promise<any> {
    return await this.usersService.findOneWithoutPass(email);
  }
}
