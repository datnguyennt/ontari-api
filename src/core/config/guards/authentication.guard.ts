import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_GUARD } from '../constants';

@Injectable()
export class AuthenticationGuard extends AuthGuard(JWT_GUARD) {}


