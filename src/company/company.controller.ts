import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, CreateCompanyResponseDto } from "./dto/create.dto";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { SpecializationService } from "./specialization.service";
import {
  IndustryDto,
  SpecializationDto,
  SpecializationResponseDto,
} from "./dto/specialization/specialization.dto";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger/dist/decorators";
import { NotFoundDto, UnAuthorizedDto } from "src/shared/dto/errors.dto";

@ApiTags("Компании")
@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly specializationService: SpecializationService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Создание компании" })
  @ApiBody({ type: CreateCompanyDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "created",
    type: CreateCompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("company:create")
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateCompanyDto,
    @Authorized("id") userId: string,
  ) {
    return this.companyService.create(dto, userId);
  }

  // specializations
  @ApiExcludeEndpoint(true)
  @Post("admin/specialization/create")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("programmer&developer:specialization_create")
  @HttpCode(HttpStatus.CREATED)
  createProjectWork(@Body() dto: SpecializationDto) {
    return this.specializationService.create(dto);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Специализации" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: SpecializationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @Get("specializations")
  @HttpCode(HttpStatus.OK)
  getProjectWorks() {
    return this.specializationService.getAll();
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Индустрии специализации" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: IndustryDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @Get("industry/:specialization_id")
  @HttpCode(HttpStatus.OK)
  getWorkSpecializations(@Param("specialization_id") specializationId: number) {
    return this.specializationService.getIndustry(specializationId);
  }
}
