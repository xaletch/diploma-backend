import { IsNumber, IsString } from "class-validator";

export class ScheduleIdsDto {
  @IsString()
  user_id: string;

  @IsNumber()
  schedule_id: number;
}
