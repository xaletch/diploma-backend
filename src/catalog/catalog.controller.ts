import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from "@nestjs/common";
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
  getCatalog(
    @Query("city") city?: string,
    @Query("cursor") cursor?: string,
    @Query("take") take?: string,
  ) {
    return this.catalogService.getCatalog(city, cursor, take ? +take : 20);
  }

  @Get("search")
  @HttpCode(HttpStatus.OK)
  search(
    @Query("q") query: string,
    @Query("city") city?: string,
    @Query("cursor") cursor?: string,
    @Query("take") take?: string,
  ) {
    return this.catalogService.search(query, city, cursor, take ? +take : 20);
  }

  @Get(":public_name")
  @HttpCode(HttpStatus.OK)
  getCompany(@Param("public_name") publicName: string) {
    return this.catalogService.getCompany(publicName);
  }
}
