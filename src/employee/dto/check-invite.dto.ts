import { IsString } from "class-validator";

export class CheckInviteDto {
  @IsString()
  token: string;
}
