import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString } from "class-validator";

export class GetChartDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: string;
}
