import { IsArray, IsUUID } from "class-validator";

export class AddedLocationsDto {
  @IsArray()
  @IsUUID("all", { each: true })
  location_ids: string[];
}
