import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { DashboardService } from "./dashboard.service";
import { AuthGuard } from "src/auth/guard/auth.guard";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { GetChartDto } from "./dto/get-chart.dto";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("summary")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("locations:read")
  @HttpCode(HttpStatus.OK)
  getSummary(@Req() req, @Query("locationId") locationId?: string) {
    const companyId = req.user.companyId;
    return this.dashboardService.getSummary(companyId, locationId);
  }

  @Get("chart")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("locations:read")
  @HttpCode(HttpStatus.OK)
  getChart(@Req() req, @Query() query: GetChartDto) {
    const companyId = req.user.companyId;
    return this.dashboardService.getChart(companyId, query);
  }
}
