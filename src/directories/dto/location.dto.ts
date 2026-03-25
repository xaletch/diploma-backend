import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";

export class DirectoryLocation {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID локации",
  })
  @IsUUID()
  @IsString()
  id!: string;

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

  @ApiProperty({
    example: "Россия, Свердловская область, Екатеринбург, ул. Вайнера, д. 15",
    description: "Адрес",
  })
  @IsString()
  address!: boolean;
}
