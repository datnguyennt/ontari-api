import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
import { TokenType, Tokens } from './types';
@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @Post('/register')
  register(@Body() authDto: AuthDTO) {
    this.authSevice.register(authDto);
  }

  @Post('/login')
  login(@Body() authDto: AuthDTO): Promise<Tokens> {
    this.authSevice.login(authDto);
  }

  @Post('/refresh-token')
  refreshToken() {
    this.authSevice.refreshToken();
  }

  @Post('/logout')
  logout() {
    this.authSevice.logout();
  }
}
