import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import { JWT_GUARD, SECRET_AT, SECRET_RT } from "../constants";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, JWT_GUARD) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRET_RT,
            passRequestToCallback: true,
        });
    }
    validate(req: Request, payload: any) {
        const refreshToken = this.extractTokenFromHeader(req);

        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        return {
            ...payload, refreshToken,
        };
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}