import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DirectoryLocation {
  @ApiProperty({
    example: "Яндекс",
    description: "Название",
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: null,
    description: "Фото",
  })
  @IsString()
  avatar!: string;

  @ApiProperty({
    example: true,
    description: "Статус (активна|неактивна)",
  })
  @IsString()
  active!: boolean;
}
