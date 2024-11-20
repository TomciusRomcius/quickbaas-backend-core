import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from 'src/common/models/userModel';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(private jwtService: JwtService) {}
  // Returns a JWT token
  async create(createUserDto: CreateUserDto): Promise<string> {
    const shouldAddPassword =
      createUserDto.password && createUserDto.password.length >= 8;
    const user = new User({
      email: createUserDto.email,
      password: shouldAddPassword ? createUserDto.password : null,
    });
    await user.save();

    const jwtToken = this.jwtService.sign({
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
