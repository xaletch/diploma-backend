import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ServiceCategoryDto {
  @ApiProperty({
    example: "Название категории",
    description: "Название категории",
    required: true,
  })
  @IsString()
  name!: string;
}

export class ServiceCategoriesDto {
  @ApiProperty({
    example: "Категория",
    description: "Название категории",
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 1,
    description: "ID",
  })
  @IsNumber()
  id!: number;
}
