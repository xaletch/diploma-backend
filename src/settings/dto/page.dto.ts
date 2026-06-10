import { ApiProperty } from "@nestjs/swagger";
import { AppPage } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, ValidateNested } from "class-validator";

export class PageDto {
  @ApiProperty({
    example: "BOOKINGS",
    description: "Название страницы",
  })
  @IsEnum(AppPage)
  page!: AppPage;

  @ApiProperty({
    example: true,
    description: "Название страницы",
  })
  @IsBoolean()
  is_visible!: boolean;
}

export class UpdatePagesDto {
  @ApiProperty({
    type: [PageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageDto)
  pages!: PageDto[];
}
