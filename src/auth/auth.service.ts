import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthWithPasswordDto } from './dto/authWithPasswordDto';
import { JwtService } from 'src/jwt/jwt.service';
import User from 'src/common/models/userModel';
import { comparePasswords, hash } from 'src/common/utils/crypto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async signInWithPassword(authWithPasswordDto: AuthWithPasswordDto) {
    const user = await User.findOne({ email: authWithPasswordDto.email });
    if (!user) {
      throw new NotFoundException(
        'User with the specified email does not exist!',
      );
    }

    // TODO: add expiry date
    if (await comparePasswords(authWithPasswordDto.password, user.password)) {
      return this.jwtService.sign({
        email: user.email,
      });
    } else {
      throw new UnauthorizedException('Password is incorrect!');
    }
  }

  async signUpWithPassword(authWithPasswordDto: AuthWithPasswordDto) {
    const passwordHash = await hash(authWithPasswordDto.password);
    const user = new User({
      email: authWithPasswordDto.email,
      password: passwordHash,
    });
    user.save();
    return this.jwtService.sign({
      email: user.email,
    });
  }
}
