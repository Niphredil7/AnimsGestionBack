import { PartialType } from '@nestjs/mapped-types';
import { CreateFeedbackDto } from './create-feedback.dto';
import { IsDate, IsNotEmpty } from 'class-validator';

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {

}
