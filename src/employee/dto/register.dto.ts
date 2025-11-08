import { ApiProperty } from "@nestjs/swagger/dist/decorators";
import { IsOptional, IsString } from "class-validator";
import { RegisterDto } from "src/auth/dto/register.dto";

export class RegisterEmployeeDto extends RegisterDto {
  @ApiProperty({
    example:
      "ee05f02f25fc0c49727ef98376f3edb75c1b2f44ff5c5c12ca7f183c146c65ea8f8d19ec8ca505ece590106e83e9efc6",
    required: true,
    description: "token",
  })
  @IsString()
  token: string;

  @IsString()
  @IsOptional()
  position?: string;
}
