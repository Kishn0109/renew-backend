import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { User as MongoUser, UserDocument } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { select } from './user.constant';
@Injectable()
export class userService {
  constructor(
    @InjectModel(MongoUser.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().lean<User[]>();
    return users;
  }
  async findOne(email: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).lean<User>();
    return user;
  }
  async findOneByQuery(query: any): Promise<User | undefined> {
    const user = await this.userModel.findOne(query).lean<User>();
    return user;
  }

  async findOneWithoutPass(email: string): Promise<User | undefined> {
    const user = await this.userModel
      .findOne({ email })
      .select(select)
      .lean<User>();
    return user;
  }

  async create(user: CreateUserDto): Promise<User> {
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
  async find(id: any): Promise<UserDto> {
    const user = await this.userModel.findOne({ _id: id }).lean<UserDto>();
    return user;
  }
  async update(user: User): Promise<User> {
    const { email, ...res } = user;
    const updatedUser = await this.userModel
      .findOneAndUpdate({ email }, { ...res }, { new: true })
      .lean<User>();
    return updatedUser;
  }
  async updateById(id: string, user: UpdateUserDto): Promise<User> {
    const { ...res } = user;
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...res }, { new: true })
      .select(select)
      .lean<User>();
    return updatedUser;
  }
  async delete(id: any): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }
}
