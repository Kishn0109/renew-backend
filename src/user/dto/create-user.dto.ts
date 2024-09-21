import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: number;

  @ApiProperty()
  password: string;
}

export class Users {
  id: number;
  name: string;
  password: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}
