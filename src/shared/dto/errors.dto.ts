import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class UnAuthorizedDto {
  @ApiProperty({
    example: "Unauthorized",
    description: "Error message",
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: 401,
    description: "Error status",
  })
  @IsNumber()
  status: number;
}
