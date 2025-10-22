import { IsString } from "class-validator";

export class ServiceCategoryDto {
  @IsString()
  name: string;
}
