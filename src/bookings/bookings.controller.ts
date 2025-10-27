import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { LoadUserGuard } from "src/user/guard/user.guard";
import { CompanyGuard } from "src/access/guard/company.guard";
import { ScopeGuard } from "src/access/guard/scope.guard";
import { Scopes } from "src/access/decorator/scopes.decorator";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post("booking")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("booking:create")
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: BookingCreateDto, @Req() req) {
    const companyId = req.user.companyId;
    return this.bookingsService.create(dto, companyId);
  }
}
