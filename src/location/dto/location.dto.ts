import { IsArray, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create.dto";

export class LocationDto extends CreateAddressDto {
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
