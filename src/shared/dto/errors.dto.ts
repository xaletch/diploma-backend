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

export class NotFoundDto {
  @ApiProperty({
    example: 404,
    description: "Error status",
  })
  @IsNumber()
  status: number;

  @ApiProperty({
    example: "Not Found",
    description: "Error title",
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: "Not Found Detail",
    description: "Error message",
  })
  @IsString()
  detail: string;
}
