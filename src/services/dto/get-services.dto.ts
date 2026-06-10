import { ApiProperty } from "@nestjs/swagger";
import { MarkEnum, ServiceType } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { PriceSortOrder } from "src/shared/constant/price.enum";
import { GetQueryDto } from "src/shared/dto/query.dto";

export class GetServicesDto extends GetQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: ServiceType })
  @IsOptional()
  @IsEnum(ServiceType)
  type?: ServiceType;

  @ApiProperty({ required: false, enum: MarkEnum })
  @IsOptional()
  @IsEnum(MarkEnum)
  mark?: MarkEnum;

  @ApiProperty({ required: false, enum: PriceSortOrder })
  @IsOptional()
  @IsEnum(PriceSortOrder)
  price_sort?: PriceSortOrder;
}
