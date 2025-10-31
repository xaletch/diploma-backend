import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class LocationAddressMapDto {
  @IsNumber()
  @IsOptional()
  lat?: any; // ВРЕМЕННАЯ ЗАГЛУШКА

  @IsNumber()
  @IsOptional()
  lng?: any; // ВРЕМЕННАЯ ЗАГЛУШКА
}
export class LocationAddressDto {
  @IsString()
  full_address: string;

  @IsString()
  @IsOptional()
  street?: string | null;

  @IsString()
  @IsOptional()
  house?: string | null;

  @IsString()
  @IsOptional()
  city?: string | null;

  @IsString()
  @IsOptional()
  region?: string | null;

  @IsString()
  @IsOptional()
  country?: string | null;

  @IsString()
  @IsOptional()
  post_code?: string | null;

  @ValidateNested()
  @Type(() => LocationAddressMapDto)
  map: LocationAddressMapDto;
}

export class LocationFirstDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  avatar?: string | null;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  timezone: string;

  @IsNumber()
  user_count: number;

  @IsPhoneNumber("RU")
  phone: string;

  @IsArray()
  @IsString({ each: true })
  category: string[];

  @IsArray()
  @IsString({ each: true })
  comfort: string[];

  @ValidateNested()
  @Type(() => LocationAddressDto)
  address: LocationAddressDto;
}
