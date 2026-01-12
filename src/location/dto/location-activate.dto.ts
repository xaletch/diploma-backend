import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsString, IsUUID, ValidateNested } from "class-validator";

export class LocationActivateDto {
  @ApiProperty({
    example: true,
    description: "boolean",
  })
  @IsBoolean()
  active: boolean;
}

class LocationResponse {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID локации",
  })
  @IsUUID()
  @IsString()
  id: string;
}

export class LocationActivateResponseDto {
  @ApiProperty({
    example: "Статус обновлен",
    description: "Сообщение",
  })
  @IsString()
  message: string;

  @ApiProperty({
    example: {
      id: "123e4567-e89b-12d3-a456-426614174000",
    },
  })
  @ValidateNested()
  @Type(() => LocationActivateDto)
  location: LocationResponse;
}
