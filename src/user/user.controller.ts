import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, BadRequestException, ParseIntPipe, HttpStatus, NotFoundException, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guard/access-token.guard';
import { CustomHttpException } from 'src/utils/custom.exception';
import { User, UserStatus } from '@prisma/client';
import { IUserWithoutPassword, ResponseInterfaceWithData } from 'src/response.interface';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { Public } from 'src/auth/decorators/public.decorator';
import { ProfileUpdateDto } from './dto/update-profile.dto';
import { PasswordUpdateDto } from './dto/update-password.dto';



@Controller('user')

export class UserController {
  authService: any;
    constructor(private readonly userService: UserService) {}
  
    @Public()
    @Post()
    async create(
      @Body() body: CreateUserDto, @Req() req: IRequestWithPayload
    ): Promise<ResponseInterfaceWithData<{ newUser: User}>> {

      const user = await this.userService.findByEmail(body.email);
      if (user)
        throw new BadRequestException('Cet email est déjà enregistré');
      return {
        data:  {newUser: await this.userService.create(body, UserStatus.CONFIRMED)},
        message: `Nouvel user créé`,
      };
    }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ users: IUserWithoutPassword[]}>> {
    return { data: {users: await this.userService.findAll()}, message: 'Liste des users' };
  }

  @Get("school/:schoolId")
  async findAllBySchool(
    @Param("schoolId") schoolId: string,
  ): Promise<ResponseInterfaceWithData<{ users: IUserWithoutPassword[] }>> {
    const users = await this.userService.findAllBySchool(schoolId);

    return {
      data: { users },
      message: "Liste des users de cette école",
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: IUserWithoutPassword; message: string }> {
    const user = await this.userService.findOne(id);
    if (!user)
      throw new CustomHttpException(`Student ${user.email} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
    return { data: user, message: 'Utilisateurs :' };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: ProfileUpdateDto,
    @Req() req: IRequestWithPayload,
  ): Promise<{ data: User; message: string }> {

    const newUser = await this.userService.update(id, body);
    return { data: newUser, message: 'User mis à jour' };
  }

  @Patch(':id/password')
  async updatePassword(
    @Param('id') id: string,
    @Body() body: PasswordUpdateDto,
    @Req() req: IRequestWithPayload,
  ): Promise<{ data: User; message: string }> {

    body.password = await this.authService.hash(body.password)
    const newPassword = await this.userService.updatePassword(id, body);
    return { data: newPassword, message: 'Password mis à jour' };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.userService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le user a été delete." };
  }
}
