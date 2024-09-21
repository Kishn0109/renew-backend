export class ForgotPasswordDto {
  readonly email: string;
}
export class ResetPasswordDto {
  readonly token: string;
  readonly newPassword: string;
}
