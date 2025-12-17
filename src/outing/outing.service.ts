import { Injectable } from '@nestjs/common';
import { CreateOutingDto } from './dto/create-outing.dto';
import { UpdateOutingDto } from './dto/update-outing.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Favorite, Outing } from '@prisma/client';

@Injectable()
export class OutingService {
  constructor(private readonly prisma:PrismaService){}
    
   async create(body: CreateOutingDto, favorite:Favorite = Favorite.IsNotFavorite): Promise<Outing> {
     const {userId,planningId, ...activityData } = body;
       return await this.prisma.outing.create({
         data: {
           ...activityData, favorite,
              userCreator: {connect:{id:userId}},
              plannings:{connect:{id:planningId}},
       }
       });
       
     }
 async findAll(): Promise<Outing[]> {
     return await this.prisma.outing.findMany();
 
   }
 async findOne(id: string): Promise<Outing | null> {
    return await this.prisma.outing.findUnique({ where: { id }});
  }

  async findByName(name: string): Promise<Outing | null> {
        return await this.prisma.outing.findFirst({
          where: { name },
        });
      }
  
    async update(
       id: string,
       body: UpdateOutingDto,
     ): Promise<Outing> {
       return await this.prisma.outing.update({
         where: { id },
         data: {
           ...body
         },
       });
     }
  
    async remove(id: string): Promise<Outing> {
        return await this.prisma.outing.delete({
          where: { id },
        });
      }
}
