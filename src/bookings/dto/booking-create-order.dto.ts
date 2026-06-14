import { PaymentType } from "@prisma/client";
import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BookingCreateOrderDto {
  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.credit_card,
    description: "Способ оплаты",
    required: true,
  })
  @IsEnum(PaymentType)
  payment_method!: PaymentType;
}
