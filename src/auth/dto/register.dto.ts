import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";

export class RegisterDto {
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
  @IsNotEmpty({ message: "Обязательное поле" })
  last_name: string;

  @IsString()
  @MinLength(8, { message: "Пароль должен быть не меньше 8 символов" })
  @IsNotEmpty({ message: "Придумайте пароль" })
  password: string;
}
