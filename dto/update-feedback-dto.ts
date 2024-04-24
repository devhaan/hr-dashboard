
import { IsString, IsNotEmpty } from 'class-validator';

export class FeedbackFirstDto {
  @IsNotEmpty()
  @IsString()
  regardingTeamWelcoming: string;

  @IsNotEmpty()
  @IsString()
  trainingModule: string;

  @IsNotEmpty()
  @IsString()
  NotClearUnderstandingAboutWorkRole: string;

  @IsNotEmpty()
  @IsString()
  regardingColleague: string;

  @IsNotEmpty()
  @IsString()
  companyCulture: string;
}

export class UpdateFeedbackDto {
  feedbackFirst: FeedbackFirstDto;
  FeedbackSecond: FeedbackFirstDto;
}
