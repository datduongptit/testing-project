import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from '../decorator/roles.decorator';
// import { User } from 'src/users/entity/users.entity';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers;
    console.log('Authorization', authorization);
    let token = authorization.authorization;
    token = token ? token.replace('Bearer ', '') : null;
    let decoded: any = {};
    if (token) {
      decoded = jwt.verify(token, 'secretKey');
    } else {
      return true;
    }

    const roleUser = decoded?.role;
    if (!requiredRoles) {
      return true;
    }

    // const { user }: { user: User } = request;

    // return requiredRoles.some((role) => user.role?.includes(role));
    return requiredRoles.some((role) => roleUser === role);
  }
}
