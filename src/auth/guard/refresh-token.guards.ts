import { Injectable, UnauthorizedException, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IPayload } from '../interfaces';


@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {


    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Pas de refresh token ?');
    }

    try {
      
      const payload : IPayload = await this.jwtService.verifyAsync(token, {
        secret: process.env.REFRESH_SECRET_KEY,
        algorithms:["HS256"]
      });
      request['user'] = payload;
      request["refreshToken"] = token;

    } catch {
      throw new UnauthorizedException('Pas de refresh token ?');
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {

    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
