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
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login-.dto';
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ApiBody({
    description: 'User credentials',
    type: LoginDto, // The response type, which in this case is an array of UserDto
  })
  async signIn(@Request() req) {
    return this.authService.signIn(req.user.email, req.user.password);
  }
  @ApiOkResponse({
    description: 'Successfully retrieved user profile.',
    type: UserDto, // The response type, which in this case is an array of UserDto
  })
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
