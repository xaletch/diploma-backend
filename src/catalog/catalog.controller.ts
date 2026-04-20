import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger/dist/decorators";
import { SuccessResponseDto } from "src/bookings/dto/booking-response.dto";

@ApiTags("Каталог")
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @ApiOperation({ summary: "Получить список компаний" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: SuccessResponseDto,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  getCatalog() {
    return this.catalogService.getCatalog();
  }
}
