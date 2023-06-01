import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    register(authDTO: AuthDTO) {}
    signIn(authDTO: AuthDTO) {
    }

    logout() {
    }

    refreshToken() {}
}
