import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class CustomerCompanyDto {
  @ApiProperty({
    example: "+7 999 999 99 99",
    required: true,
    description: "Телефон",
  })
  @IsPhoneNumber("RU")
  @IsNotEmpty({ message: "Обязательное поле" })
  phone: string;

  @ApiProperty({
    example: "Толян - постоянный клиент",
    required: false,
    description: "Заметка",
  })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({
    example: false,
    required: false,
    description: "Статус",
  })
  @IsBoolean()
  @IsOptional()
  is_banned?: boolean;
}
