import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ScheduleIdsDto {
  @ApiProperty({
    example: "9e282713-cba7-4d49-a431-a6f00e3d4635",
    description: "ID сотрудника",
    required: true,
  })
  @IsString()
  user_id: string;

  @ApiProperty({
    example: 1,
    description: "ID расписания",
    required: true,
  })
  @IsNumber()
  schedule_id: number;
}
