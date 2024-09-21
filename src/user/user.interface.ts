export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
}
