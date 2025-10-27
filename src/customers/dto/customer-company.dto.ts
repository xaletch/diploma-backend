import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CustomerCompanyDto {
  @IsString()
  customer_id: string;

  @IsString()
  @IsOptional()
  note?: string;

  @IsBoolean()
  @IsOptional()
  is_banned?: boolean;
}
