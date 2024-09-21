import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { userService } from './user.service';
import { User } from './user.interface';
import { Public } from 'src/auth/constants';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: userService) {}
  @Public()
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Public()
  @Post()
  async create(@Body() user: User): Promise<User> {
    return this.userService.create(user);
  }
}
