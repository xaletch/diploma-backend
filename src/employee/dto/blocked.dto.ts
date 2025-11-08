import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class EmployeeBlockedDto {
  @ApiProperty({
    example: false,
    required: false,
    description: "Заблокирован",
  })
  @IsBoolean()
  is_banned: boolean;
}

export class EmployeeBlockedResponseDto {
  @ApiProperty({
    example: true,
    description: "Статус",
  })
  @IsBoolean()
  success: boolean;
}
