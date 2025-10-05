import { IsArray, IsString } from "class-validator";

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
