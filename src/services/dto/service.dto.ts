import { DATE_TYPE, DAYS, MarkEnum, ServiceType } from "@prisma/client";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ServiceCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional({ each: true })
  public_name?: string;

  @IsEnum(MarkEnum)
  mark: MarkEnum;

  @IsNumber()
  duration: number;

  @IsEnum(ServiceType)
  type: ServiceType;

  @IsArray()
  @IsEnum(DAYS, { each: true })
  days: DAYS[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  time_start: string;

  @IsString()
  time_end: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  cost_price?: number;

  @IsNumber()
  @IsOptional()
  discount_price?: number;

  @IsEnum(DATE_TYPE)
  date_type?: DATE_TYPE;

  @IsArray()
  @IsEnum(DAYS, { each: true })
  @IsOptional()
  discount_days?: DAYS[];

  @IsString()
  @IsOptional()
  discount_time_start?: string;

  @IsString()
  @IsOptional()
  discount_time_end?: string;
}
