import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @Post('/register')
  register(@Body() authDto: AuthDTO) {
    this.authSevice.register(authDto);
  }

  @Post('/sign-in')
  signIn(@Body() authDto: AuthDTO) {
    this.authSevice.signIn(authDto);
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
