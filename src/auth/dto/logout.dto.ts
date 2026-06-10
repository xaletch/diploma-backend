import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LogoutDto {
  @ApiProperty({
    example: "6b775c66bf1434375715107a6860a811c...",
    required: true,
    description: "token",
  })
  @IsString()
  @IsNotEmpty({ message: "Обязательное поле" })
  token!: string;
}
