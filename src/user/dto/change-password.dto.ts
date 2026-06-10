import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    example: "12345678",
    required: true,
    description: "Старый пароль",
  })
  @IsString()
  @MinLength(8, { message: "Пароль должен быть не меньше 8 символов" })
  @IsNotEmpty({ message: "Введите старый пароль" })
  old_password!: string;

  @ApiProperty({
    example: "12345678",
    required: true,
    description: "Новый пароль",
  })
  @IsString()
  @MinLength(8, { message: "Пароль должен быть не меньше 8 символов" })
  @IsNotEmpty({ message: "Введите новый пароль" })
  new_password!: string;
}
