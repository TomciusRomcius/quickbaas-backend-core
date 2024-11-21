import { Injectable } from '@nestjs/common';
import { AuthWithPasswordDto } from './dto/authWithPasswordDto';
import { JwtService } from 'src/jwt/jwt.service';
import User from 'src/common/models/userModel';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signInWithPassword(authWithPasswordDto: AuthWithPasswordDto) {
    const user = await User.findOne({ email: authWithPasswordDto.email });
    if (!user) {
      throw new Error('User with the specified email does not exist!');
    }

    // TODO: add expiry date
    if (authWithPasswordDto.password === user.password) {
      return this.jwtService.sign({
        email: user.email,
      });
    } else {
      throw new Error('Password is incorrect!');
    }
  }

  async signUpWithPassword(authWithPasswordDto: AuthWithPasswordDto) {
    const user = await new User({
      email: authWithPasswordDto.email,
      password: authWithPasswordDto.password,
    });
    user.save();
    return this.jwtService.sign({
      email: user.email,
    });
  }
}