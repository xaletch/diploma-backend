import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PaymentType } from "@prisma/client";
import { IsEnum, IsOptional, IsString, IsUUID, Matches } from "class-validator";

export class BookingBaseDto {
  @ApiProperty({
    example: "Customer API",
    description: "Название бронирования",
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: "10:00",
    description: "Время начала в формате HH:mm",
    required: true,
    pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Время должно быть в формате HH:mm",
  })
  start_time!: string;

  @ApiProperty({
    example: "12:45",
    description: "Время окончания в формате HH:mm",
    required: true,
    pattern: "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$",
  })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Время должно быть в формате HH:mm",
  })
  end_time!: string;

  @ApiProperty({
    example: "24-11-2025",
    description: "Дата в формате DD-MM-YYYY",
    required: true,
    pattern: "^\\d{2}-\\d{2}-\\d{4}$",
  })
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: "Дата должна быть в формате DD-MM-YYYY",
  })
  date!: string;

  @ApiPropertyOptional({
    example: "Клиент просит напомнить за час",
    description: "Комментарий к бронированию",
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({
    example: "5d48c70b-c018-4e93-8673-b6be4f4fad93",
    description: "ID услуги",
    required: true,
  })
  @IsUUID()
  service_id!: string;

  @ApiProperty({
    example: "89e1ff87-f273-47a4-ab34-a90c716c59f0",
    description: "ID сотрудника",
    required: true,
  })
  @IsUUID()
  employee_id!: string;

  @ApiProperty({
    enum: PaymentType,
    example: PaymentType.credit_card,
    description: "Способ оплаты",
    required: true,
  })
  @IsEnum(PaymentType)
  payment_method!: PaymentType;
}
