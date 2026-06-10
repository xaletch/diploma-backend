import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { GetQueryDto } from "src/shared/dto/query.dto";

export enum CustomerSortOrder {
  NEWEST = "newest",
  OLDEST = "oldest",
}

export class GetCustomersDto extends GetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: CustomerSortOrder })
  @IsOptional()
  @IsEnum(CustomerSortOrder)
  sort?: CustomerSortOrder;
}
