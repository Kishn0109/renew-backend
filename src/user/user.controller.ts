import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { userService } from './user.service';
import { User } from './user.interface';
import { Public } from 'src/auth/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto, UpdateUserParamsDto } from './dto/update-user.dto';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: userService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {}

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
  @Patch(':id')
  @ApiOkResponse({
    description: 'Successfully updated user.',
  })
  async update(
    @Param() params: UpdateUserParamsDto,
    @Body() body: UpdateUserDto,
  ): Promise<string[]> {
    try {
      let message = [];
      const user = await this.userService.find(params.id);
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (body.name) {
        await this.userService.updateById(params.id, body);
        message.push('Name updated successfully');
      }
      if (body.email) {
        const payload = { sub: body.email, id: params.id };
        const token = await this.jwtService.signAsync(payload, {
          expiresIn: '1d',
          jwtid: 'email-verification',
        });
        this.mailService.sendEmailVerificationMail(body.email, token);
        message.push('Verification email sent successfully');
      }
      return message;
    } catch (error) {
      throw new BadRequestException(error);
    }
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
