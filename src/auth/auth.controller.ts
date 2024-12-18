import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthWithPasswordDto } from './dto/authWithPasswordDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in-with-password')
  async signInWithPassword(@Body() authWithPasswordDto: AuthWithPasswordDto) {
    return await this.authService.signInWithPassword(authWithPasswordDto);
  }

  @Post('sign-up-with-password')
  async signUpWithPassword(@Body() authWithPasswordDto: AuthWithPasswordDto) {
    return await this.authService.signUpWithPassword(authWithPasswordDto);
  }
}
