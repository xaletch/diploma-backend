import { DATE_TYPE, DAYS } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class ServiceCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional({ each: true })
  public_name?: string;

  @IsString()
  mark: string;

  @IsNumber()
  duration: number;

  @IsUUID("all")
  customer_id: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  cost_price?: number;

  @IsEnum(DATE_TYPE)
  date_type: DATE_TYPE;

  @IsArray()
  @IsEnum(DAYS, { each: true })
  days: DAYS[];

  @IsString()
  time_start: string;

  @IsString()
  time_end: string;
}
