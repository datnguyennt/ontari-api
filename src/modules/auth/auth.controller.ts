import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authSevice: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDTO): Promise<any> {
    return this.authSevice.register(registerDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDTO): Promise<any> {
    return this.authSevice.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  refreshToken(@Req() req: Request) {
    const user = req.user;
    console.log(req);
    return this.authSevice.refreshToken(user['sub'], user['refreshToken']);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post('/logout')
  logout(@Req() req: Request) {
    const user = req.user;
    return this.authSevice.logout(user['sub']);
  }
}
