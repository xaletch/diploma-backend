import { OrderStatus, PaymentType } from "@prisma/client";
import { IsArray, IsEnum, IsOptional, IsString } from "class-validator";

export class OrderCreateDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsEnum(PaymentType)
  payment_method: PaymentType;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsString({ each: true })
  booking_ids: string[];
}
