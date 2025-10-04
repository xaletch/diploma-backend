import { IsArray, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class LocationDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsPhoneNumber("RU")
  phone: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  comfort?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  category?: string[];
}
