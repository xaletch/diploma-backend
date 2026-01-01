import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
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
import { LocationGuard } from "src/access/guard/location.guard";
import { ApiTags } from "@nestjs/swagger/dist/decorators";
import { BookingStatusDto } from "./dto/booking-status.dto";
import { BookingUpdateDto } from "./dto/booking-update.dto";
import { AuthCustomerGuard } from "src/customers/guard/auth.guard";
import { AuthorizedCustomer } from "src/customers/decorators/authorized.decorator";
import { ICustomer } from "src/customers/types/customer.type";
import { BookingCreateCustomerDto } from "./dto/booking-create-customer.dto";

@ApiTags("Бронирование")
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

  @Get("bookings/location/:location_id")
  @UseGuards(AuthGuard, LoadUserGuard, LocationGuard, ScopeGuard)
  @Scopes("bookings:read")
  @HttpCode(HttpStatus.OK)
  getAll(@Param("location_id") locationId: string, @Req() req) {
    const userId = req.user.id;
    return this.bookingsService.getAll(userId, locationId);
  }

  @Get("booking/:booking_id")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("booking-detail:read")
  @HttpCode(HttpStatus.OK)
  details(@Param("booking_id") bookingId: string) {
    return this.bookingsService.details(bookingId);
  }

  @Patch("booking/:booking_id")
  @UseGuards(AuthGuard, LoadUserGuard, CompanyGuard, ScopeGuard)
  @Scopes("booking:update")
  @HttpCode(HttpStatus.OK)
  update(
    @Body() dto: BookingUpdateDto,
    @Param("booking_id") bookingId: string,
    @Req() req,
  ) {
    const companyId = req.user.companyId;
    return this.bookingsService.update(dto, bookingId, companyId);
  }

  @Put("booking/:booking_id")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("booking:status")
  @HttpCode(HttpStatus.OK)
  statusUpdate(
    @Body() dto: BookingStatusDto,
    @Param("booking_id") bookingId: string,
  ) {
    return this.bookingsService.statusUpdate(dto, bookingId);
  }

  @Delete("booking/:booking_id")
  @UseGuards(AuthGuard, LoadUserGuard, ScopeGuard)
  @Scopes("booking:delete")
  @HttpCode(HttpStatus.OK)
  delete(@Param("booking_id") bookingId: string) {
    return this.bookingsService.delete(bookingId);
  }

  @Get("bookings/me")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthCustomerGuard)
  // @Scopes("bookings-client-me:read")
  getMyBookings(@AuthorizedCustomer() customer: ICustomer) {
    return this.bookingsService.getMeBookings(customer.id);
  }

  @Post("booking/client")
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthCustomerGuard)
  // @Scopes("bookings-client-me:create")
  createCustomerBooking(
    @Body() dto: BookingCreateCustomerDto,
    @AuthorizedCustomer() customer: ICustomer,
  ) {
    return this.bookingsService.createCustomerBooking(dto, customer.id);
  }
}
