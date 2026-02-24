import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsUUID } from "class-validator";

export class AddedLocationsDto {
  @ApiProperty({
    example: [
      "89e1ff87-f273-47a4-ab34-a90c716c59f0",
      "5d48c70b-c018-4e93-8673-b6be4f4fad93",
    ],
    description: "Массив id локаций",
  })
  @IsArray()
  @IsUUID("all", { each: true })
  location_ids: string[];
}
