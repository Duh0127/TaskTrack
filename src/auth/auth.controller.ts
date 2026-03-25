import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() credentials: AuthLoginDto) {
    return this.authService.login(credentials.email, credentials.password);
  }

  @Post('/signup')
  signup(@Body() credentials: AuthSignupDto) {
    return this.authService.signup(credentials);
  }
}
