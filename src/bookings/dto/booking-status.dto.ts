import { BookingStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class BookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
