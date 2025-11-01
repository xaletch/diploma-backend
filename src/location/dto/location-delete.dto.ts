import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsUUID, ValidateNested } from "class-validator";

class LocationDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID локации",
  })
  @IsUUID()
  @IsString()
  id: string;

  @ApiProperty({
    example: "Яндекс",
    description: "Название локации",
  })
  @IsString()
  name: string;
}

export class LocationDeleteDto {
  @ApiProperty({
    example: "Локация удалена",
    description: "Сообщение",
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "Яндекс",
    },
  })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
