import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RegisterDTO, LoginDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(registerDto: RegisterDTO): Promise<any> {
        const user = await this.getUser(registerDto.email);
        if (user) throw new ForbiddenException("Email already exists")
        try {

            const hash = await this.hashData(registerDto.password);
            const uuid = uuidv4();
            const newUser = await this.prisma.user.create({
                data: {
                    uuid: uuid,
                    email: registerDto.email,
                    password: hash,
                    phoneNumber: registerDto.phoneNumber,
                    firstName: registerDto.firstName,
                    lastName: registerDto.lastName,
                    birthday: registerDto.birthday,
                    address: registerDto.address,
                },
                select: {
                    uuid: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    birthday: true,
                    address: true,
                    phoneNumber: true,
                    createAt: true,
                    updateAt: true,
                }
            });
            const token = await this.convertToJwtToken(uuid, newUser.email);
            // await this.updateHash(newUser.id, token.refresh_token);
            return { token, user: newUser };
        } catch (error) {
            console.log(error);
            return { error }
        }

    }


    async login(loginDto: LoginDTO): Promise<any> {
        const user = await this.getUser(loginDto.email);
        if (!user) {
            throw new ForbiddenException('User invalid');
        }
        const passwordCompare = await bcrypt.compare(loginDto.password, user.password);
        if (!passwordCompare) {
            throw new ForbiddenException('Wrong password');
        }
        delete user.password;
        delete user.id;
        const token = await this.convertToJwtToken(user.uuid, user.email);
        // await this.updateHash(user.id, token.refresh_token);
        return { token, user };
    }

    async logout(userId: number) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                password: {
                    not: null,
                }
            },
            data: {
                password: null,
            }
        });
    }

    async refreshToken(id: number, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: id },
        });
        if (!user) {
            throw new ForbiddenException('User not found');
        }
        const rTmatches = await bcrypt.compare(rt, user.password);
        if (!rTmatches) {
            throw new ForbiddenException('Invalid creadential');
        }
        const token = await this.convertToJwtToken(user.uuid, user.email);
        // await this.updateHash(user.id, token.refresh_token);
        return token;
    }


    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getUser(email: string): Promise<User | undefined> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        return user;
    }

    async convertToJwtToken(userId: string, email: string): Promise<Tokens> {
        const payload = {
            sub: userId,
            email: email,
        };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                payload,
            },
                {
                    secret: this.configService.get('SECRET_AT'),
                    expiresIn: '10m',
                },
            ),
            this.jwtService.signAsync({
                payload
            },
                {
                    secret: this.configService.get('SECRET_RT'),
                    expiresIn: 60 * 60 * 24 * 7,
                },
            ),
        ]);
        return { accessToken: at, refreshToken: rt, };
    }

    async updateHash2(userId: number, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: { id: userId, },
            data: {
                password: hash,
            }
        });
    }
}
