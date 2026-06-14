import { OrderStatus, PaymentType } from "@prisma/client";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

export class OrderCreateDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  status: OrderStatus | undefined;

  @IsEnum(PaymentType)
  @IsOptional()
  payment_method?: PaymentType | undefined;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsString({ each: true })
  booking_ids: string[] | undefined;
}
