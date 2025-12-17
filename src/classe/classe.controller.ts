import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, HttpStatus, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { ClasseService } from './classe.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { Class } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from 'src/auth/guard/access-token.guard';

@Controller('classe')

export class ClasseController {
  constructor(private readonly classeService: ClasseService) {}

  @Post()
  async create(
        @Body() body: CreateClasseDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newClass: Class}>> {
        return {
          data:  {newClass: await this.classeService.create(body)},
          message: `Nouvel classe créé`,
        };
      }
      
@Get('me')
  async getClasseForCurrentUser(
    @Req() req: IRequestWithPayload,
  ): Promise<{ data: { classe: Class }; message: string }> {
    const classe = await this.classeService.findByUser(req.user.id);

    if (!classe) {
      throw new NotFoundException("Aucune classe trouvée pour cet utilisateur");
    }

    return {
      data: { classe },
      message: "Classe du référent",
    };
  }

  @Get()
  async findAll(): Promise<ResponseInterfaceWithData<{ users: Class[]}>> {
      return { data: {users: await this.classeService.findAll()}, message: 'Liste des classes' };
    }

  @Get(':id')
  async findOne(
      @Param('id') id: string,
    ): Promise<{ data: Class; message: string }> {
      const classe = await this.classeService.findOne(id);
      if (!classe)
        throw new CustomHttpException(`Class ${classe} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: classe, message: 'Classes :' };
    }

    @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
): Promise<{ data: Class | null; message: string }> {
  const classe = await this.classeService.findByUser(userId);

  if (!classe) {
    throw new CustomHttpException(
      `Aucune classe trouvée pour cet utilisateur`,
      HttpStatus.NOT_FOUND,
      "UC-gIU-1"
    );
  }

  return { data: classe, message: "Classe trouvée pour l'utilisateur" }
}

  @Patch(':id')
  async update(
      @Param('id') id: string,
      @Body() body: UpdateClasseDto,
    ): Promise<{ data: Class; message: string }> {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException(`class ${id} not exist`);
      }
      const newUser = await this.classeService.update(id, body);
      return { data: newUser, message: 'Classse mis à jour' };
    }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.classeService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "La classe a été delete." };
  }
}
