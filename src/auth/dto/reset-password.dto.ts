import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The token provided for password reset.',
    example: '123456abcdef',
  })
  readonly token: string;

  @ApiProperty({
    description: 'The new password to be set.',
    example: 'newStrongPassword123!',
  })
  readonly password: string;

  @ApiProperty({
    description: 'The email associated with the account.',
    example: 'user@example.com',
  })
  readonly email: string;
}
