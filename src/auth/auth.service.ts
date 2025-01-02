import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthWithPasswordDto } from './dto/authWithPasswordDto';
import User from 'src/common/models/userModel';
import { comparePasswords, hash } from 'src/common/utils/crypto';
import JWT from 'src/common/utils/jwt';

@Injectable()
export class AuthService {
  async signInWithPassword(authWithPasswordDto: AuthWithPasswordDto) {
    const user = await User.findOne({ email: authWithPasswordDto.email });
    if (!user) {
      throw new NotFoundException(
        'User with the specified email does not exist!',
      );
    }

    // TODO: add expiry date
    if (await comparePasswords(authWithPasswordDto.password, user.password)) {
      return JWT.sign({
        email: user.email,
      });
    } else {
      throw new UnauthorizedException('Password is incorrect!');
    }
  }

  async signUpWithPassword(authWithPasswordDto: AuthWithPasswordDto) {
    const passwordHash = await hash(authWithPasswordDto.password);
    let jwt;
    try {
      const user = await User.create({
        email: authWithPasswordDto.email,
        password: passwordHash,
      });
      jwt = JWT.sign({
        email: user.email,
      });
    } catch (err) {
      throw new InternalServerErrorException('Failed to sign up');
    }

    return jwt;
  }
}
