import { IsArray, IsString } from "class-validator";

export type Interval = {
  start: string;
  end: string;
};

export class ScheduleCreateDto {
  @IsString()
  date: string;

  @IsArray()
  intervals: Interval[];

  @IsString()
  user_id: string;
}
