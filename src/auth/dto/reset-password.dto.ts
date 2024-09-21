export class ResetPasswordDto {
  readonly token: string;
  readonly newPassword: string;
  readonly email: string;
}
