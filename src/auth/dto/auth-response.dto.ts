import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." })
  access_token: string;

  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." })
  refresh_token: string;
}

export class RefreshResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6..." })
  access_token: string;
}
