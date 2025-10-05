import { ROLE } from "@prisma/client";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class EmployeeDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: "Обязательное поле" })
  email: string;

  @IsPhoneNumber("RU")
  @IsNotEmpty({ message: "Обязательное поле" })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: "Обязательное поле" })
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  role: ROLE;

  @IsString()
  position: string;

  @IsString()
  location_id: string;
}
