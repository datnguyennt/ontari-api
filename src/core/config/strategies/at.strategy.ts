import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PrismaService } from "src/core/prisma/prisma.service";
import { JWT_GUARD, SECRET_AT } from "../constants";
type JwtPayload = {
    payload: {
        sub: string,
        email: string,
    }
};
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, JWT_GUARD) {
    constructor(
        configService: ConfigService,
        private prismaService: PrismaService,
    ) {
        super({
            //access token id added to every request (excep login, register)
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get(SECRET_AT),
        })
    }
    async validate(jwtPayload: JwtPayload) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: jwtPayload.payload.email,
            },
        })
        delete user.password;
        return user;

    }
}