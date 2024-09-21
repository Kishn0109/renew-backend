import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Unique identifier for the user' })
  id: number;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  name: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for the user',
    minLength: 6,
  })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;
}
