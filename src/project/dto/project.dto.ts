import {
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class ProjectDto {
  @IsString({ message: "Укажите название проекта" })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  house?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  work_id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  specialization_ids: string[];

  @IsPhoneNumber("RU")
  @IsOptional()
  phone: string;
}
