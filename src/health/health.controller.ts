import {
  Controller,
  Get,
  HttpStatus,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "src/prisma/prisma.service";

@ApiTags("Здововье апки")
@Controller()
export class HealthController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get("health")
  @ApiOperation({ summary: "Жизнь апишки" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: "Network error",
  })
  health() {
    return { success: true };
  }

  @Get("health/ready")
  @ApiOperation({ summary: "Жизнь бдшки" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: "BD error",
  })
  async ready() {
    try {
      await this.prismaService.specialization.findFirst({ where: { id: 1 } });
      return { success: true };
    } catch (err) {
      throw new ServiceUnavailableException({
        message: "BD error",
        error: err instanceof Error ? err.message : err,
      });
    }
  }
}
