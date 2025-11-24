import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../roles.enum';


@Injectable()

export class JwtAuthGuard extends AuthGuard("jwt"){}


export class AdminGuard  implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
    

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
        throw new ForbiddenException('User not found');
        }

        const isAdmin = user.role === UserRole.ADMIN || user.isAdmin === true;
        
        if (!isAdmin) {
        throw new ForbiddenException('Access denied. Admin privileges required.');
        }

        return true;
    }
}