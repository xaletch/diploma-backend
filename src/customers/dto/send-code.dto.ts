import { IsNotEmpty, IsPhoneNumber } from "class-validator";

export class SendCodeDto {
  @IsPhoneNumber("RU")
  @IsNotEmpty({ message: "Обязательное поле" })
  phone: string;
}
