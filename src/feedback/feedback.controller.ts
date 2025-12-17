import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ResponseInterfaceWithData } from 'src/response.interface';
import { IRequestWithPayload } from 'src/auth/interfaces';
import { Feedback } from '@prisma/client';
import { CustomHttpException } from 'src/utils/custom.exception';
import { AuthGuard } from 'src/auth/guard/access-token.guard';

@Controller('feedback')

export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(
        @Body() body: CreateFeedbackDto, @Req() req: IRequestWithPayload
      ): Promise<ResponseInterfaceWithData<{ newFeedback: Feedback}>> {
        const feedback = await this.feedbackService.findOne(body.planningId, req.user.id);
        if (feedback)
          throw new BadRequestException('Ce feedback est déjà enregistré');
        return {
          data:  {newFeedback: await this.feedbackService.create(body, req.user.id)},
          message: `Nouvel feedback créé`,
        };
      }

  @Get()
  async getAllFeeback() {
    const data = await this.feedbackService.findAll();
    return {
      data,
      message: 'Résumé des feedbacks par activité',
    };
  }

  @Get(':id')
  async findOne(
      @Param('id') planningId: string, @Req() req: IRequestWithPayload
    ): Promise<{ data: Feedback; message: string }> {
      const feedback = await this.feedbackService.findOne(planningId, req.user.id);
      if (!feedback)
        throw new CustomHttpException(`feedback ${feedback} not exist`, HttpStatus.BAD_REQUEST, "UC-gI-1");
      return { data: feedback, message: 'Feedbacks :' };
    }

  @Patch(':id')
  async update(
      @Param('id') planningId: string,
      @Body() body: UpdateFeedbackDto,
      @Req() req: IRequestWithPayload,
    ): Promise<{ data: Feedback; message: string }> {
      const feedback = await this.feedbackService.findOne(planningId, req.user.id);
      if (!feedback) {
        throw new NotFoundException(`Feedback ${planningId}, ${req.user.id} not exist`);
      }
      const newFeedback = await this.feedbackService.update(planningId, req.user.id, body);
      return { data: newFeedback, message: 'Feedback mis à jour' };
    }

  @Delete(':id')
  async remove(
    @Param('id') planningId: string,
    @Req() req: IRequestWithPayload
  ): Promise<{ message: string }> {
    try {
      await this.feedbackService.remove(planningId, req.user.id);
    } catch {
      throw new NotFoundException();
    }
    return { message: "Le feedback a été delete." };
  }
}
