import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './constants';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
} from 'src/user/dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async signIn(@Request() req) {
    return this.authService.signIn(req.user.email, req.user.password);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUser(req.user.email);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    return this.authService.requestPasswordReset(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
