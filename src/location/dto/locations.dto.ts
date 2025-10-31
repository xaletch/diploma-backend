import {
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

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
}

export class LocationsDto {
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
