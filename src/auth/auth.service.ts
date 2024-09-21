import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { userService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/user/dto/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: userService,
    private jwtService: JwtService,
    private mailService: MailService,
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

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, email, newPassword } = resetPasswordDto;

    // Find user with the provided reset token
    const user = await this.usersService.findOneByQuery(email);

    if (
      !user ||
      Date.now() > user.resetPasswordExpires ||
      !(await bcrypt.compare(token, user.resetPasswordToken))
    ) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await this.usersService.update(user);
  }

  async requestPasswordReset(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the reset token before storing it in the DB
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Store the hashed reset token and expiration date in the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await this.usersService.update(user);

    // Send reset token to the user's email
    const resetUrl = `http://your-frontend-url.com/reset-password?token=${resetToken}`;
    await this.mailService.sendResetPasswordEmail(user.email, resetUrl);
  }
}
