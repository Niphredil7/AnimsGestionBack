import {
  Body,
  Controller,
  Post,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
  Req,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SigninDto } from './dto/signin.dto';
import { UserService } from 'src/user/user.service';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from './guard/access-token.guard';
import { JwtService } from '@nestjs/jwt';
import { IRequestWithPayload, IRequestWithPayloadAndRefresh } from './interfaces';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guard/refresh-token.guards';
import { User } from '@prisma/client';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('signup')
  async signUp(@Body() body: RegisterDto) {

    body.password = await this.authService.hash(body.password);
    const user = await this.userService.create(body);
    return {
      data: { user },
      message: 'Vous êtes inscrits',
    };
  }
  @Public()
  @Post('signin')
  async signIn(@Body() body: SigninDto) {

    const user = await this.userService.findByEmail(body.email);
    if (!user) {
      throw new CustomHttpException(
        "Cet utilisateur n'existe pas",
        HttpStatus.NOT_FOUND,
        'AC-s1-1',
      );
    }

    const compare = await this.authService.compare(
      user.password,
      body.password,
    );
    if (!compare)
      throw new CustomHttpException(
        'bad credentials',
        HttpStatus.PRECONDITION_FAILED,
        'AC-s2-2,',
      );

    const access_token = await this.authService.generateJwt(
      { id: user.id },
      { expiresIn: '10m', secret: process.env.SECRET_KEY },
    );
    const refresh_token = await this.authService.generateJwt(
      { id: user.id },
      { expiresIn: '1d', secret: process.env.REFRESH_SECRET_KEY },
    );


    const hashed_refresh_token = await this.authService.hash(refresh_token);

    await this.authService.upsertToken(user.id, hashed_refresh_token);
 
    delete user.password;

    return {
      data: { user, access_token, refresh_token  },
      message: 'Vous êtes connecté',
    };
  } 

  @Public()
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: IRequestWithPayloadAndRefresh) {

// const decoded = this.jwtService.verify(body.refreshToken, {secret: process.env.REFRESH_SECRET_KEY})
// console.log(decoded)

    const refresh = await this.authService.findUniqueToken(req.user.id);
    const compare = await this.authService.compare(
      refresh.token,
      req.refreshToken,
    );
    if (!compare) throw new UnauthorizedException('Non autorisé');
    const access_token = await this.authService.generateJwt(
      { id: req.user.id },
      { expiresIn: '10m', secret: process.env.SECRET_KEY },
    );

    const refresh_token = await this.authService.generateJwt(
      { id: req.user.id },
      { expiresIn: '1d', secret: process.env.REFRESH_SECRET_KEY },
    );
    const hashed_refresh_token = await this.authService.hash(refresh_token);



    this.authService.upsertToken(req.user.id, hashed_refresh_token);

    return {
      data: { access_token, refresh_token },
      message: 'Vous êtes bien reconnectés',
    };
  }

  // @Post('forgotpass')
  // async forgotPassword(@Body() body: ForgotPasswordDto) {
  //   console.log('début signin back');
  //   const user = await this.userService.findByEmail(body.email);
  //   if (!user) {
  //     throw new CustomHttpException(
  //       "Cet utilisateur n'existe pas",
  //       HttpStatus.NOT_FOUND,
  //       'AC-s1-1',
  //     );
  //   }
  //   console.log(user, 'signin back 2');
  //   const compare = await this.authService.compare(
  //     user.code,
  //     body.code,
  //   );
  //   if (!compare)
  //     throw new CustomHttpException(
  //       'bad credentials',
  //       HttpStatus.PRECONDITION_FAILED,
  //       'AC-s2-2,',
  //     );
  //   console.log('arrivé a compare');
  //   const access_token = await this.authService.generateJwt(
  //     { id: user.id },
  //     { expiresIn: '1h', secret: process.env.SECRET_KEY },
  //   );
  //   const refresh_token = await this.authService.generateJwt(
  //     { id: user.id },
  //     { expiresIn: '3d', secret: process.env.REFRESH_SECRET_KEY },
  //   );
  //   console.log('arrivé aux tokens');

  //   const hashed_refresh_token = await this.authService.hash(refresh_token);
  //   console.log('arrivé hashed');
  //   await this.authService.upsertToken(user.id, hashed_refresh_token);
  //   console.log('arrivé au return'); 
  //   delete user.password;
  //   return {
  //     data: { user, access_token, refresh_token  },
  //     message: 'Vous êtes connecté',
  //   };
  // } 

}

