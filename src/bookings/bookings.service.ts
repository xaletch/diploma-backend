import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BookingCreateDto } from "./dto/booking-create.dto";
import { IBookingDetails, IBookings } from "./type/bookings.type";
import { BookingCreate } from "./type/booking-create.type";
import { BookingStatusDto } from "./dto/booking-status.dto";
import { BookingById } from "./type/booking-by-id.type";
import { BookingUpdateDto } from "./dto/booking-update.dto";
import { BookingCreateCustomerDto } from "./dto/booking-create-customer.dto";
import { BookingStatus, OrderStatus } from "@prisma/client";

@Injectable()
export class BookingsService {
  public constructor(private readonly prismaService: PrismaService) {}

  private getDayShort(dayIndex: number): string {
    const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return map[dayIndex];
  }

  private dateParse(date: string): Date {
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}`);
  }

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

  private async validateService(
    serviceId: string,
    date: string,
    start_time: string,
    end_time: string,
    companyId: string,
  ): Promise<boolean> {
    const parsed = this.dateParse(date);
    const dayWeek = this.getDayShort(parsed.getDay());
    const service = await this.prismaService.service.findFirst({
      where: {
        id: serviceId,
        companyId,
        days: { has: dayWeek },
        timeStart: { lte: start_time },
        timeEnd: { gte: end_time },
      },
    });

    if (!service)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка расписания услуги",
          detail: "Услуга не доступна в выбранное время.",
          meta: { service_id: serviceId },
        },
        HttpStatus.BAD_REQUEST,
      );

    return true;
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

  private async validateCustomer(id: string): Promise<string> {
    // const customer = await this.prismaService.customerCompany.findUnique({
    //   where: { id, companyId },
    //   select: { id: true, customerId: true },
    // });
    /** 
      ТЕПЕРЬ ПРОВЕРЯЕМ КЛИЕНТА НЕ В CUSTOMER_COMPANY А НАПРЯМУЮ В CUSTOMER
    **/
    const customer = await this.prismaService.customer.findUnique({
      where: { id },
      select: { id: true },
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

    return customer.id;
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
          detail: "Сотрудник не работает в указанный период времени.",
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
    booking_id: string = "",
  ): Promise<boolean> {
    const isOverlapping = await this.prismaService.booking.findFirst({
      where: {
        employeeId,
        date,
        id: { not: booking_id },
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

  private async validateCustomerOverlapping(
    customerId: string,
    date: string,
    start_time: string,
    end_time: string,
  ) {
    const overlap = await this.prismaService.booking.findFirst({
      where: {
        customerId,
        date,
        startTime: { lt: end_time },
        endTime: { gt: start_time },
      },
    });

    if (overlap)
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          title: "Ошибка бронирования",
          detail: "Услуга уже забронирована другим пользователем",
          meta: { customer_id: customerId },
        },
        HttpStatus.BAD_REQUEST,
      );
  }

  async create(dto: BookingCreateDto, company_id: string) {
    return this.prismaService.$transaction(async (t) => {
      await this.validateLocation(dto.location_id, dto.service_id);
      const locationId = await this.validateEmployeeLocation(
        dto.employee_id,
        dto.location_id,
      );
      await this.validateEmployeeService(dto.employee_id, dto.service_id);
      const customerId = await this.validateCustomer(dto.customer_id);
      await this.validateService(
        dto.service_id,
        dto.date,
        dto.start_time,
        dto.end_time,
        company_id,
      );
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
      await this.validateCustomerOverlapping(
        customerId,
        dto.date,
        dto.start_time,
        dto.end_time,
      );

      const booking = await t.booking.create({
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
        select: {
          id: true,
          name: true,
          status: true,
          date: true,
          location: { select: { id: true, name: true } },
          employee: {
            select: { id: true, firstName: true, lastName: true, phone: true },
          },
          service: {
            select: {
              id: true,
              name: true,
              mark: true,
              price: { select: { price: true } },
              duration: true,
            },
          },
        },
      });

      /** СОЗДАНИЕ ЗАКАЗА V1 **/
      const bookings = await t.booking.findMany({
        where: {
          id: { in: [booking.id] },
          orderId: null,
          status: BookingStatus.confirmed,
        },
        include: { service: { select: { price: true } } },
      });

      const subtotal = bookings.reduce(
        (s, b) => s + (b.service.price?.price ?? 0),
        0,
      );

      const order = await t.order.create({
        data: {
          status: OrderStatus.pending,
          subtotal,
          paymentMethod: dto.payment_method,
          bookings: { connect: bookings.map((b) => ({ id: b.id })) },
        },
        select: {
          id: true,
          paymentMethod: true,
          status: true,
          subtotal: true,
          comment: true,
          discount: true,
        },
      });

      const res = {
        ...booking,
        employee: {
          id: booking.employee.id,
          first_name: booking.employee.firstName,
          last_name: booking.employee.lastName,
          phone: booking.employee.phone,
        },
        order: {
          id: order.id,
          status: order.status,
          subtotal: order.subtotal,
          comment: order.comment,
          discount: order.discount,
          payment_method: order.paymentMethod,
        },
      };

      return res;
    });
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
        date: true,
        comment: true,
        customer: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        employee: {
          select: {
            id: true,
            phone: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const res: IBookings[] = bookings.map((booking) => ({
      id: booking.id,
      name: booking.name,
      status: booking.status,
      start_time: booking.startTime,
      end_time: booking.endTime,
      date: booking.date,
      comment: booking.comment,
      customer: {
        id: booking.customer.id,
        phone: booking.customer.phone,
        name: `${booking.customer.firstName} ${booking.customer.lastName}`,
      },
      employee: {
        id: booking.employee.id,
        first_name: booking.employee.firstName,
        last_name: booking.employee.lastName,
        phone: booking.employee.phone,
        position: booking.employee.position,
      },
    }));

    return res;
  }

  async getById(bookingId: string): Promise<BookingById> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
      select: { id: true, name: true, status: true },
    });

    if (!booking)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Бронирование не найдено.",
          meta: { booking_id: bookingId },
        },
        HttpStatus.NOT_FOUND,
      );

    return booking;
  }

  async delete(bookingId: string): Promise<SuccessResponse> {
    await this.getById(bookingId);

    await this.prismaService.booking.delete({ where: { id: bookingId } });

    return { success: true };
  }

  async update(
    dto: BookingUpdateDto,
    bookingId: string,
    company_id: string,
  ): Promise<BookingCreate> {
    await this.getById(bookingId);
    await this.validateLocation(dto.location_id, dto.service_id);
    const locationId = await this.validateEmployeeLocation(
      dto.employee_id,
      dto.location_id,
    );
    await this.validateEmployeeService(dto.employee_id, dto.service_id);
    const customerId = await this.validateCustomer(dto.customer_id);
    await this.validateService(
      dto.service_id,
      dto.date,
      dto.start_time,
      dto.end_time,
      company_id,
    );
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
      bookingId,
    );

    const booking = await this.prismaService.booking.update({
      where: { id: bookingId },
      data: {
        name: dto.name,
        date: dto.date,
        startTime: dto.start_time,
        endTime: dto.end_time,
        comment: dto.comment,
        employeeId: dto.employee_id,
        customerId: customerId,
        serviceId: dto.service_id,
        locationId: dto.location_id,
      },
      select: { id: true, name: true, status: true },
    });

    return booking;
  }

  async statusUpdate(
    dto: BookingStatusDto,
    bookingId: string,
  ): Promise<SuccessResponse> {
    await this.getById(bookingId);

    await this.prismaService.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
    });

    return { success: true };
  }

  async details(bookingId: string): Promise<IBookingDetails> {
    const booking = await this.prismaService.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        name: true,
        status: true,
        startTime: true,
        endTime: true,
        date: true,
        comment: true,
        location: { select: { id: true, name: true } },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            birthday: true,
          },
        },
        employee: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: { select: { price: true, costPrice: true } },
          },
        },
      },
    });

    if (!booking)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Бронирование не найдено.",
          meta: { booking_id: bookingId },
        },
        HttpStatus.NOT_FOUND,
      );

    const res: IBookingDetails = {
      id: booking.id,
      name: booking.name,
      status: booking.status,
      start_time: booking.startTime,
      end_time: booking.endTime,
      date: booking.date,
      comment: booking.comment,
      location: {
        id: booking.location.id,
        name: booking.location.name,
      },
      customer: {
        id: booking.customer.id,
        first_name: booking.customer.firstName,
        last_name: booking.customer.lastName,
        phone: booking.customer.phone,
        email: booking.customer.email,
        birthday: booking.customer.birthday,
      },
      employee: {
        id: booking.employee.id,
        first_name: booking.employee.firstName,
        last_name: booking.employee.lastName,
        phone: booking.employee.phone,
      },
      service: {
        id: booking.service.id,
        name: booking.service.name,
        duration: booking.service.duration,
        prices: {
          price: booking.service.price?.price,
          cost_price: booking.service.price?.costPrice,
        },
      },
    };

    return res;
  }

  async getMeBookings(customerId: string) {
    const customer = await this.prismaService.customerAccount.findUnique({
      where: { id: customerId },
      select: { customerId: true },
    });

    if (!customer)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Клиент не найден.",
          meta: { customer_id: customer },
        },
        HttpStatus.NOT_FOUND,
      );

    const bookings = await this.prismaService.booking.findMany({
      where: { customerId: customer.customerId },
      select: {
        id: true,
        name: true,
        status: true,
        startTime: true,
        endTime: true,
        date: true,
        employee: {
          select: {
            id: true,
            phone: true,
            avatar: true,
            firstName: true,
            lastName: true,
            position: true,
          },
        },
        location: {
          select: {
            name: true,
            id: true,
            avatar: true,
            address: {
              select: {
                street: true,
                city: true,
                house: true,
                country: true,
              },
            },
          },
        },
        service: {
          select: {
            name: true,
            publicName: true,
            mark: true,
            duration: true,
            category: true,
          },
        },
        order: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const res = bookings.map((booking) => ({
      id: booking.id,
      name: booking.name,
      status: booking.status,
      start_time: booking.startTime,
      end_time: booking.endTime,
      date: booking.date,
      employee: {
        id: booking.employee.id,
        first_name: booking.employee.firstName,
        last_name: booking.employee.lastName,
        phone: booking.employee.phone,
        avatar: booking.employee.avatar,
        position: booking.employee.position,
      },
      location: {
        id: booking.location.id,
        name: booking.location.name,
        avatar: booking.location.avatar,
        address: booking.location.address,
      },
      service: {
        name: booking.service.name,
        public_name: booking.service.publicName,
        mark: booking.service.mark,
        duration: booking.service.duration,
        category: booking.service.category || null,
      },
    }));

    return res;
  }

  async createCustomerBooking(
    dto: BookingCreateCustomerDto,
    customerId: string,
  ) {
    const company = await this.prismaService.company.findUnique({
      where: { publicName: dto.company },
      select: { id: true },
    });

    if (!company)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Компания не найдена.",
          meta: { public_name: dto.company },
        },
        HttpStatus.NOT_FOUND,
      );

    const customer = await this.prismaService.customerAccount.findUnique({
      where: { id: customerId },
      select: { customerId: true },
    });

    if (!customer)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Клиент не найден.",
          meta: { customer_id: customer },
        },
        HttpStatus.NOT_FOUND,
      );

    const createDto = {
      name: dto.name,
      start_time: dto.start_time,
      end_time: dto.end_time,
      date: dto.date,
      comment: dto.comment,
      location_id: dto.location_id,
      service_id: dto.service_id,
      employee_id: dto.employee_id,
      customer_id: customer?.customerId,
      status: dto.status,
      payment_method: dto.payment_method,
    } satisfies BookingCreateDto;

    const res = this.create(createDto, company.id);

    return res;
  }
}
