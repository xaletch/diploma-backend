import { IsPhoneNumber, IsString } from "class-validator";

export class AuthVerifyDto {
  @IsPhoneNumber("RU")
  phone: string;

  @IsString()
  code: string;
}
