import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { User as MongoUser, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { MailService } from './mail.service';
@Injectable()
export class userService {
  constructor(
    @InjectModel(MongoUser.name) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().lean<User[]>();
    return users;
  }
  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).lean<User>();
    return user;
  }
  async findOneWithoutPass(email: string): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({ email })
      .select('-_id -__v -password')
      .lean<User>();
    return user;
  }

  async create(user: User): Promise<User> {
    const { name, email, password } = user;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    return;
  }

  // Request Password Reset
  async requestPasswordReset(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash the reset token before storing it in the DB
    const hashedToken = await bcrypt.hash(resetToken, 10);

    // Store the hashed reset token and expiration date in the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    await user.save();

    // Send reset token to the user's email
    const resetUrl = `http://your-frontend-url.com/reset-password?token=${resetToken}`;
    await this.mailService.sendResetPasswordEmail(user.email, resetUrl);
  }
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    // Find user with the provided reset token
    const user = await this.userModel.findOne({
      resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
    });

    if (!user || !(await bcrypt.compare(token, user.resetPasswordToken))) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token fields
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
  }
}
