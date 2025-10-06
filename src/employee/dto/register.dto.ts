import { IsString } from "class-validator";
import { RegisterDto } from "src/auth/dto/register.dto";

export class RegisterEmployeeDto extends RegisterDto {
  @IsString()
  token: string;
}
