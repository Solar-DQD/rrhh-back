import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JWTPayload {
    id: string;
    correo: string;
    tipoUsuario: string;
    exp: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')!
        });
    };

    async validate(payload: JWTPayload) {
        if (!payload.id || !payload.correo) {
            throw new UnauthorizedException('Invalid JWT payload');
        };

        return payload;
    };
};