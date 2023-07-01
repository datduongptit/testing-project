import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../publicRoutes/public';
import { AuthService } from '../auth.service';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    if (info) {
      if (info instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
        // return this.authService.refreshTokens(context.getRequest());
      }
      if (info instanceof Error) {
        throw new UnauthorizedException('Token has expired');
        // return this.authService.refreshTokens(context.getRequest());
      }
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
