import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    };

    handleRequest(error: any, user: any, info: any) {
        if ( error || !user ) {
            throw error || new UnauthorizedException('Invalid JWT token');
        };
        
        return user;
    };
};