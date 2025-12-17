import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { User, UserRole, UserStatus } from '@prisma/client';
import { IUserWithoutPassword } from 'src/response.interface';
import { ProfileUpdateDto } from './dto/update-profile.dto';
import { PasswordUpdateDto } from './dto/update-password.dto';


@Injectable()
export class UserService {
  constructor(private readonly prisma:PrismaService){}

async create(body: CreateUserDto, status: UserStatus = UserStatus.NOT_CONFIRMED, role: UserRole = UserRole.VISITOR): Promise<User> {

    return await this.prisma.user.create({
      data: {
        ...body, status, role
    }
    });
    
  }
  async findAll(): Promise<IUserWithoutPassword[]> {
    return await this.prisma.user.findMany({omit:{password:true}});

  }

 async findAllBySchool(schoolId: string): Promise<IUserWithoutPassword[]> {
  return this.prisma.user.findMany({
   where: {
      schoolId,
      OR: [
        { role: UserRole.ANIMATOR },
        { role: UserRole.ANIMATOR_PARENT },
      ],
    },
    omit: {
      password: true,
    },
  });
}

  async findOne(id: string): Promise<IUserWithoutPassword | null> {
    return await this.prisma.user.findUnique({ where: { id }, omit:{password:true }});
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }
  async findByName(username: string): Promise<IUserWithoutPassword | null> {
    return await this.prisma.user.findFirst({
      where: { username },omit:{password:true }
    });
  }

    async update(
    id: string,
    body: UpdateUserDto,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...body
      },
    });
  }

  async updatePassword(
    id: string,
    body: PasswordUpdateDto,
  ): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        ...body
      },
    });
  }

  

  async remove(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
