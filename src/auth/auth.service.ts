import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CustomHttpException } from 'src/utils/custom.exception';
import * as argon2 from "argon2"
import { IJwtOptions, IPayload } from './interfaces';
import { Token, TokenType, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {


 constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async hash(toHash:string): Promise<string>{

    try {
  return await argon2.hash(toHash);
} catch (err) {
  throw new CustomHttpException("BadRequest", HttpStatus.BAD_REQUEST, "AS-h-1")
}
  }


async compare(hashed:string, notHashed:string):Promise<boolean>{
  try {
    return await argon2.verify(hashed, notHashed)
  } catch (error) {
    throw new CustomHttpException("BadRequest", HttpStatus.BAD_REQUEST, "AS-c-1,"
    )
  }
}

  async generateJwt(payload: IPayload, options: IJwtOptions): Promise<string> {
    return await this.jwtService.signAsync(payload, options);
  }

  async upsertToken(
    userId: string,
    token: string,
    type: TokenType = TokenType.REFRESH_TOKEN,
    expiresAt?: Date,
  ): Promise<Token> {
    return this.prisma.token.upsert({
      create: { type, userId, token, expiresAt },

      where: { type_userId: { type, userId } },

      update: { token, expiresAt },
    });
  }

  async findUniqueToken(
    userId: string,
    type: TokenType = TokenType.REFRESH_TOKEN,
  ) {
    return this.prisma.token.findUnique({
      where: { type_userId: { type, userId } },
    });
  }

}



export { IPayload }
