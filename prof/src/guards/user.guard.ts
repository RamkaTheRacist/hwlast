import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        try {
            const req = context.switchToHttp().getRequest();
            const params = req.params;
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const user = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
            if (params.id == user.userId) {
                return true;
            }
            throw new UnauthorizedException({ message: 'No access' });
        } catch (error) {
            throw new UnauthorizedException({ message: 'No access' });
        }
    }
}