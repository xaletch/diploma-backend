import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create.dto";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { SpecializationService } from "./specialization.service";
import { SpecializationDto } from "./dto/specialization/specialization.dto";

@Controller("company")
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly specializationService: SpecializationService,
  ) {}

  @Authorization()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateCompanyDto,
    @Authorized("id") userId: string,
  ) {
    return this.companyService.create(dto, userId);
  }

  // specializations
  @Authorization()
  @Post("admin/specialization/create")
  createProjectWork(@Body() dto: SpecializationDto) {
    return this.specializationService.create(dto);
  }

  @Authorization()
  @Get("specializations")
  getProjectWorks() {
    return this.specializationService.getAll();
  }

  @Authorization()
  @Get("industry/:specialization_id")
  getWorkSpecializations(@Param("specialization_id") specializationId: number) {
    return this.specializationService.getIndustry(specializationId);
  }
}
