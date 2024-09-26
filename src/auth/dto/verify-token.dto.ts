import { ApiProperty } from '@nestjs/swagger';

export class VerifyToken {
  @ApiProperty()
  readonly token: string;
}
