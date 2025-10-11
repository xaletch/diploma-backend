import { IsNumber, IsString } from "class-validator";

export class RoleDto {
  @IsNumber()
  role_id: number;

  @IsString()
  name: string;
}
