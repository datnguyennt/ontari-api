import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService,) {}

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }
    async getToken(userId: number, email: string) {
        const [at,rt] = 
        const accessToken = this.jwtService.signAsync({
            sub: userId,
            email,
        },
            {
                expiresIn: 60 * 15,
            },
        );
    }

    async register(authDTO: AuthDTO): Promise<Tokens> {
        const hash = await this.hashData(authDTO.password);
        const user = await this.prisma.user.create({
            data: {
                email: authDTO.email,
                hash,
            }
        });
    }
    login(authDTO: AuthDTO) {
    }

    logout() {
    }

    refreshToken() {}
}
