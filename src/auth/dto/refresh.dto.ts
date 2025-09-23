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
  @IsString()
  refresh_token: string;
  @IsString()
  old_token: string;
}
