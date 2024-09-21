import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { userService } from './user.service';
import { User } from './user.interface';
import { Public } from 'src/auth/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';

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
  @Get(':id')
  @ApiOkResponse({
    description: 'Successfully retrieved user.',
    type: UserDto, // The response type, which in this case is an array of UserDto
  })
  async findOne(@Param() params: GetUserDto): Promise<UserDto> {
    return this.userService.find(params.id);
  }

  @Public()
  @Delete(':id')
  @ApiOkResponse({
    description: 'Successfully deleted user.',
  })
  async delete(@Param() params: GetUserDto): Promise<void> {
    try {
      await this.userService.delete(params.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Public()
  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return await this.userService.create(user);
  }
}
