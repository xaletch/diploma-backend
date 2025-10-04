import { CURRENCY } from "@prisma/client";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  currency: CURRENCY;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  house?: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  post_code?: string;

  @IsString()
  country: string;

  @IsString()
  region: string;

  @IsString()
  timezone: string;

  @IsString()
  timezone_offset: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  lat: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  lng: string;
}
