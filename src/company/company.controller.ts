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
import { CreateCompanyDto } from "./dto/create.dto";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { SpecializationService } from "./specialization.service";
import { SpecializationDto } from "./dto/specialization/specialization.dto";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { AuthGuard } from "src/auth/guard/auth.guard";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly specializationService: SpecializationService,
  ) {}

  @Post()
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
  @Post("admin/specialization/create")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("programmer&developer:specialization_create")
  @HttpCode(HttpStatus.CREATED)
  createProjectWork(@Body() dto: SpecializationDto) {
    return this.specializationService.create(dto);
  }

  @Authorization()
  @Get("specializations")
  @HttpCode(HttpStatus.OK)
  getProjectWorks() {
    return this.specializationService.getAll();
  }

  @Authorization()
  @Get("industry/:specialization_id")
  @HttpCode(HttpStatus.OK)
  getWorkSpecializations(@Param("specialization_id") specializationId: number) {
    return this.specializationService.getIndustry(specializationId);
  }
}
