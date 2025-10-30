import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefreshDto {
  @IsString()
  refresh_token: string;
  @IsString()
  old_token: string;
  @IsString()
  ipAddress: string;
}

export class RefreshRequestDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    required: true,
    description: "refresh token",
  })
  @IsString()
  refresh_token: string;
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    required: true,
    description: "old access token",
  })
  @IsString()
  old_token: string;
}
