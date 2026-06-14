import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { GetQueryDto } from "src/shared/dto/query.dto";

export enum OrderSortOrder {
  NEWEST = "newest",
  OLDEST = "oldest",
  PRICE_ASC = "price_asc",
  PRICE_DESC = "price_desc",
}

export class GetOrdersDto extends GetQueryDto {
  @ApiProperty({ required: false, enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ required: false, enum: OrderSortOrder })
  @IsOptional()
  @IsEnum(OrderSortOrder)
  sort?: OrderSortOrder;
}
