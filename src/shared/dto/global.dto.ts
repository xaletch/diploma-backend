import { ApiProperty } from "@nestjs/swagger";

export class GlobalSuccessDto {
  @ApiProperty({ example: true })
  success: boolean;
}
