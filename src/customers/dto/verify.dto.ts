import { IsNotEmpty, IsNumber, IsPhoneNumber } from "class-validator";

export class VerifyCodeDto {
  @IsPhoneNumber("RU")
  @IsNotEmpty({ message: "Обязательное поле" })
  phone: string;

  @IsNumber()
  code: number;
}
