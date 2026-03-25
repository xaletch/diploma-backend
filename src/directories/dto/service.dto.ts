import { ApiProperty } from "@nestjs/swagger";
import { MarkEnum } from "@prisma/client";
import { IsEnum, IsString, IsUUID } from "class-validator";

export class DirectoryService {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID услуги",
  })
  @IsUUID()
  @IsString()
  id!: string;

  @ApiProperty({
    example: "Услуга 1",
    description: "Название",
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: "red | orange | green | blue | purple | teal | pink",
    description: "цвет (обозначение)",
  })
  @IsEnum(MarkEnum)
  mark!: MarkEnum;

  @ApiProperty({
    example: "ysluga-1",
    description: "Название",
  })
  @IsString()
  public_name!: string;
}
