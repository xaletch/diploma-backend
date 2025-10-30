import { IsOptional, IsString, Matches } from "class-validator";

export class BookingUpdateDto {
  @IsString()
  name: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "Время должно быть в формате HH:mm" })
  start_time: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: "Время должно быть в формате HH:mm" })
  end_time: string;

  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: "Дата должна быть в формате YYYY-MM-DD",
  })
  date: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsOptional()
  location_id: string;

  @IsString()
  service_id: string;

  @IsString()
  employee_id: string;

  @IsString()
  customer_id: string;
}
