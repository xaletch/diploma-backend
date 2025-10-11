import { IsNumber, IsString } from "class-validator";

export class InviteDto {
  @IsString()
  email: string;

  @IsString()
  location_id: string;

  @IsNumber()
  role: number;
}
