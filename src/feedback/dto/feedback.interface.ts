import { Favorite } from "@prisma/client";

export interface FeedbackWithActivity {
  planningId: string;   
  status: Favorite;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  activityId: string | null;
  activityName: string | null;
}

export interface FeedbackActivitySummary{
  activityId: string;
  activityName: string;
  likes: number;
}