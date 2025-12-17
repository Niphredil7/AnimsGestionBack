import { Controller, Get, Post, Body, Patch, Param, Delete, Req, BadRequestException, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { School } from '@prisma/client';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from 'src/auth/guard/access-token.guard';

@Controller('school')

export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
   async create(
          @Body() body: CreateSchoolDto, @Req() req: IRequestWithPayload
        ): Promise<ResponseInterfaceWithData<{ newSchool: School}>>{

          const school = await this.schoolService.findByAddress(body.name);
          if (school)
            throw new BadRequestException('Cet ecole est déjà enregistré');
          return {
            data:  {newSchool: await this.schoolService.create(body)},
            message: `Nouvel ecole créé`,
          };
        
        }

  @Get()
 async findAll(): Promise<ResponseInterfaceWithData<{ schools: School[]}>> {
      return { data: {schools: await this.schoolService.findAll()}, message: 'Liste des écoles' };
    }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: School; message: string }> {
    const school = await this.schoolService.findOne(id);
    if (!school)
      throw new CustomHttpException(`Ecole ${school.id} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
    return { data: school, message: 'Ecole :' };
  }

  @Patch(':id')
 async update(
    @Param('id') id: string,
    @Body() body: UpdateSchoolDto,
  ): Promise<{ data: School; message: string }> {
    const school = await this.findOne(id);
    if (!school) {
      throw new NotFoundException(`School ${id} not exist`);
    }
    const newSchool = await this.schoolService.update(id, body);
    return { data: newSchool, message: 'Ecole mis à jour' };
  }

  @Delete(':id')
async remove(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.schoolService.remove(id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "L'école a été delete." };
  }
}
