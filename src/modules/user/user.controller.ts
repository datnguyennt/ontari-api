import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from 'src/core/config/decorators/index';
import { AuthenticationGuard } from 'src/core/config/guards';

@Controller('users')
export class UserController {
    @UseGuards(AuthenticationGuard)
    @Get('/profile')
    profile(@GetUser() user: User) {
        return user;
    }
}
