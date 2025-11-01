import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsString } from "class-validator";

export class SpecializationDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  // @IsUrl({ protocols: ["http"], require_protocol: true })
  @IsString()
  icon: string;

  @IsArray()
  @IsString({ each: true })
  industryNames: string[];
}

export class SpecializationResponseDto {
  @ApiProperty({
    example: 1,
    description: "Specialization ID",
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "Красота",
    description: "Название специализации",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "Маникюр, Депиляция и др.",
    description: "Описание специализации - указываются индустрии через запятую",
  })
  @IsString()
  description: string;

  @ApiProperty({
    example:
      "http://localhost:8080/v1/assets/specialization/specialization-services.svg",
    description: "svg иконка",
  })
  @IsString()
  icon: string;
}

export class IndustryDto {
  @ApiProperty({
    example: 1,
    description: "Industry ID",
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: "Красота",
    description: "Название индустрии",
  })
  @IsString()
  name: string;
}
