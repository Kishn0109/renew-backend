import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { userService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [userService, MailService],
  exports: [userService],
})
export class UserModule {}
