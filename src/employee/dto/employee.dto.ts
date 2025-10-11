import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";
import { RoleIds } from "src/role/types/role.type";

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

  @IsNumber()
  role: RoleIds;

  @IsString()
  position: string;

  @IsString()
  location_id: string;
}
