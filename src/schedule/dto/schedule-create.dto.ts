import { IsArray, IsString, Matches } from "class-validator";

export type Interval = {
  start: string;
  end: string;
};

export class ScheduleCreateDto {
  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: "Дата должна быть в формате YYYY-MM-DD",
  })
  date: string;

  @IsArray()
  intervals: Interval[];

  @IsString()
  user_id: string;
}
