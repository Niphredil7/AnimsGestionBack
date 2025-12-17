import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Activity, Favorite } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma:PrismaService){}
  
 async create(
  body: CreateActivityDto,
  favorite: Favorite = Favorite.IsNotFavorite,
): Promise<Activity> {
  const { roomId, categoryMaterialId, userId, ...activityData } = body;



  // (optionnel) vérifier que la salle existe
  const room = await this.prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new BadRequestException("Salle introuvable");
  }
  /*
  const existingCount = await this.prisma.planningActivity.count({
    where: {
      activity: {
        roomId,
      },
    },
  });

  if (existingCount >= 2) {
    throw new BadRequestException(
      `Cette salle est déjà utilisée pour les deux services à ce moment.`,
    );
  }
  */

  return this.prisma.activity.create({
    data: {
      ...activityData,
      favorite, // ou body.favorite si tu préfères : favorite: body.favorite ?? Favorite.IsNotFavorite
      userCreator: { connect: { id: userId } },
      room: { connect: { id: roomId } },
      ...(categoryMaterialId && {
        categoryMaterial: { connect: { id: categoryMaterialId } },
      }),
    },
  });
}


  async findAll(): Promise<Activity[]> {
     return await this.prisma.activity.findMany();
 
   }
 async findOne(id: string): Promise<Activity | null> {
    return await this.prisma.activity.findUnique({ where: { id }});
  }

    async findByName(name: string): Promise<Activity | null> {
      return await this.prisma.activity.findFirst({
        where: { name },
      });
    }

    async findByUser(userId:string):Promise<Activity[]> {
      return await this.prisma.activity.findMany({where : {userId}})
    }

  async update(
     id: string,
     body: UpdateActivityDto,
   ): Promise<Activity> {
     return await this.prisma.activity.update({
       where: { id },
       data: {
         ...body
       },
     });
   }

  async remove(id: string): Promise<Activity> {
      return await this.prisma.activity.delete({
        where: { id },
      });
    }
}
