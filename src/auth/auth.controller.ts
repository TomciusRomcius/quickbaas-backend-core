import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthWithPasswordDto } from './dto/authWithPasswordDto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in-with-password')
  async signInWithPassword(
    @Res() res: Response,
    @Body() authWithPasswordDto: AuthWithPasswordDto,
  ) {
    const jwt = await this.authService.signInWithPassword(authWithPasswordDto);
    res.cookie('user', jwt, {
      expires: new Date(Date.now() + 900000),
    });
    res.send();
  }

  @Post('sign-up-with-password')
  async signUpWithPassword(
    @Res() res: Response,
    @Body() authWithPasswordDto: AuthWithPasswordDto,
  ) {
    const jwt = await this.authService.signUpWithPassword(authWithPasswordDto);
    res.cookie('user', jwt);
    res.send();
  }
}
