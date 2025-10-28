import { IsArray, IsUUID } from "class-validator";

export class AddedUsersDto {
  @IsArray()
  @IsUUID("all", { each: true })
  user_ids: string[];
}
