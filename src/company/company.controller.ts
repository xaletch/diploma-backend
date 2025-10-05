import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CreateCompanyDto } from "./dto/create.dto";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";

@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Authorization()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateCompanyDto,
    @Authorized("id") userId: string,
  ) {
    return this.companyService.create(dto, userId);
  }
}
