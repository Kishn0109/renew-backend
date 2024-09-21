import { Body, Controller, Get, Post } from '@nestjs/common';
import { userService } from './user.service';
import { User } from './user.interface';
import { Public } from 'src/auth/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: userService) {}

  @Public()
  @Get()
  @ApiOkResponse({
    description: 'Successfully retrieved list of users.',
    type: [UserDto], // The response type, which in this case is an array of UserDto
  })
  async findAll(): Promise<UserDto[]> {
    return this.userService.findAll();
  }

  @Public()
  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }
}
