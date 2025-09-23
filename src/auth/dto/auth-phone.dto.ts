import { IsPhoneNumber } from "class-validator";

export class AuthPhoneDto {
  @IsPhoneNumber("RU")
  phone: string;
}
