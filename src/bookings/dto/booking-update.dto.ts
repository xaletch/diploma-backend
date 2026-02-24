import { IsUUID } from "class-validator";
import { BookingBaseDto } from "./booking-base.dto";
import { ApiProperty } from "@nestjs/swagger";

export class BookingUpdateDto extends BookingBaseDto {
  @ApiProperty({
    example: "d91e3d55-6ba2-4c26-bd7a-55a7ce35e13b",
    description: "ID клиента",
    required: true,
  })
  @IsUUID()
  customer_id!: string;

  @ApiProperty({
    example: "a8f4ff39-f908-472e-bf19-259b557c952a",
    description: "ID локации",
    required: true,
  })
  @IsUUID()
  location_id!: string;
}
