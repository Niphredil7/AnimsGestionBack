import { EMoment, NotificationType } from "@prisma/client";
import { ArrayNotEmpty, IsArray, IsString } from "class-validator";

export interface UserNotificationData {
  id: string;
  type: NotificationType;   
  message: string;
  createdAt: Date;
  seen: boolean;

  data:
    | {
        kind: "HAPPENNING";
        id: string;
        title: string;
        content: string;
        dateStart: Date;
        dateEnd: Date;
      }
    | {
        kind: "ACTIVITY";
        id: string;
        moment:EMoment;
        validatedAt:Date,
        activityId?:string,
        outingId?:string,
        planningId:string,
        classId:string,
      }
    | null;
}


export class CreateActivityNotificationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsString()
  planningActivityId: string;

  @IsString()
  message: string;
}

export class CreateHappenningNotificationDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsString()
  happenningId: string;

  @IsString()
  message: string;
}