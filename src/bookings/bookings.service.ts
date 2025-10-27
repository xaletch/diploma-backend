import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { IBookings } from "./type/bookings.type";
import { BookingCreate } from "./type/booking-create.type";

@Injectable()
export class BookingsService {
  public constructor(private readonly prismaService: PrismaService) {}

  private async validateLocation(
    locationId: string,
    serviceId: string,
  ): Promise<boolean> {
    const location = await this.prismaService.locationService.findFirst({
      where: { locationId, serviceId },
    });

    if (!location)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка локации",
          detail: "Данная услуга не доступна в выбранном месте",
          meta: { location_id: locationId },
        },
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }

  private async validateEmployeeLocation(
    userId: string,
    locationId,
  ): Promise<string> {
    const employeeLocation = await this.prismaService.userLocation.findFirst({
      where: { userId, locationId },
    });

    if (!employeeLocation)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка сотрудника",
          detail: "Выбранный сотрудник не работает в данной локации.",
          meta: { employee_id: userId },
        },
        HttpStatus.BAD_REQUEST,
      );

    return employeeLocation.id;
  }

  private async validateEmployeeService(
    userId: string,
    serviceId: string,
  ): Promise<boolean> {
    const employee = await this.prismaService.userService.findFirst({
      where: { userId, serviceId },
    });

    if (!employee)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка услуги",
          detail: "Выбранный сотрудник не оказывает данную услугу.",
          meta: { employee_id: userId },
        },
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }

  private async validateEmployee(
    id: string,
    companyId: string,
  ): Promise<string> {
    const customer = await this.prismaService.customerCompany.findUnique({
      where: { id, companyId },
      select: { id: true, customerId: true },
    });

    if (!customer)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка клиента",
          detail: "Указанный клиент не найден в системе",
          meta: { customer_id: id },
        },
        HttpStatus.NOT_FOUND,
      );

    return customer.customerId;
  }

  private async validateCustomerWorked(
    date: string,
    userLocationId: string,
    start_time: string,
    end_time: string,
  ): Promise<boolean> {
    const isWorked = await this.prismaService.schedule.findFirst({
      where: {
        date: date,
        userLocationId,
        intervals: {
          some: {
            start: { lte: start_time },
            end: { gte: end_time },
          },
        },
      },
    });

    if (!isWorked)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка расписания",
          detail: "Сотрудник не работает в указанный период времени",
          meta: { employee_id: userLocationId },
        },
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }

  private async validateOverlapping(
    employeeId: string,
    date: string,
    end_time: string,
    start_time: string,
  ): Promise<boolean> {
    const isOverlapping = await this.prismaService.booking.findFirst({
      where: {
        employeeId,
        date,
        startTime: { lt: end_time },
        endTime: { gt: start_time },
      },
    });

    if (isOverlapping)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка бронирования",
          detail:
            "У выбранного сотрудника уже существует бронирование на указанное время.",
          meta: { employee_id: employeeId },
        },
        HttpStatus.BAD_REQUEST,
      );

    return true;
  }

  async create(
    dto: BookingCreateDto,
    company_id: string,
  ): Promise<BookingCreate> {
    await this.validateLocation(dto.location_id, dto.service_id);
    const locationId = await this.validateEmployeeLocation(
      dto.employee_id,
      dto.location_id,
    );
    await this.validateEmployeeService(dto.employee_id, dto.service_id);
    const customerId = await this.validateEmployee(dto.customer_id, company_id);
    await this.validateCustomerWorked(
      dto.date,
      locationId,
      dto.start_time,
      dto.end_time,
    );
    await this.validateOverlapping(
      dto.employee_id,
      dto.date,
      dto.end_time,
      dto.start_time,
    );

    const booking = await this.prismaService.booking.create({
      data: {
        name: dto.name,
        date: dto.date,
        startTime: dto.start_time,
        endTime: dto.end_time,
        comment: dto.comment,
        status: dto.status,
        employeeId: dto.employee_id,
        customerId: customerId,
        serviceId: dto.service_id,
        locationId: dto.location_id,
      },
      select: { id: true, name: true, status: true },
    });

    return booking;
  }

  async getAll(userId: string, locationId: string): Promise<IBookings[]> {
    const user = await this.prismaService.userLocation.findUnique({
      where: { userId_locationId: { userId, locationId } },
      select: { role: { select: { name: true } } },
    });

    if (!user)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка пользователя",
          detail: "Пользователь не найден",
          meta: { user_id: userId },
        },
        HttpStatus.NOT_FOUND,
      );

    const isOwner = user.role?.name === "owner";

    const bookings = await this.prismaService.booking.findMany({
      where: isOwner ? { locationId } : { locationId, employeeId: userId },
      select: {
        id: true,
        name: true,
        status: true,
        startTime: true,
        endTime: true,
        comment: true,
        customer: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
      },
    });

    const res: IBookings[] = bookings.map((booking) => ({
      id: booking.id,
      name: booking.name,
      status: booking.status,
      start_time: booking.startTime,
      end_time: booking.endTime,
      comment: booking.comment,
      customer: {
        id: booking.customer.id,
        phone: booking.customer.phone,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
      },
    }));

    return res;
  }
}
