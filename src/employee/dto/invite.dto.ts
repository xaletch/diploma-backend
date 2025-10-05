import { ROLE } from "@prisma/client";
import { IsString } from "class-validator";

export class InviteDto {
  @IsString()
  email: string;

  @IsString()
  location_id: string;

  @IsString()
  role: ROLE;
}
