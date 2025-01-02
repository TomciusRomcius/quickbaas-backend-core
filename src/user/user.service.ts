import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from 'src/common/models/userModel';
import JWT from 'src/common/utils/jwt';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<string> {
    const shouldAddPassword =
      createUserDto.password && createUserDto.password.length >= 8;
    const user = new User({
      email: createUserDto.email,
      password: shouldAddPassword ? createUserDto.password : null,
    });
    await user.save();

    const jwtToken = JWT.sign({
      email: createUserDto.email,
    });
    return jwtToken;
  }

  async findAll() {
    const users = await User.find();
    return users;
  }

  async findOne(id: number) {
    const user = User.findById(id);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    throw new Error('Not implemented');
  }

  async remove(id: number) {
    await User.findByIdAndDelete(id);
  }
}
