import { IsBoolean } from "class-validator";

export class EmployeeBlockedDto {
  @IsBoolean()
  is_banned: boolean;
}
