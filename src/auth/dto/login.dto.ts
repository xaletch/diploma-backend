import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty({ message: "Обязательное поле" })
  email: string;

  @IsString()
  @MinLength(8, { message: "Пароль должен быть не меньше 8 символов" })
  @IsNotEmpty({ message: "Введите пароль" })
  password: string;
}
