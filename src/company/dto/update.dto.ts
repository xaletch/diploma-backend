import { ApiProperty } from "@nestjs/swagger";
import { CURRENCY } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateCompanyDto {
  @ApiProperty({
    example: "Яндекс",
    required: true,
    description: "Название компании",
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: "RUB",
    required: true,
    description: "Валюта",
    enum: CURRENCY,
  })
  @IsEnum(CURRENCY)
  @IsOptional()
  currency?: CURRENCY;
}
