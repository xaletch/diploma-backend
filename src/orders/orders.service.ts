/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderCreateDto } from './dto/order-create.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  public constructor(private readonly prismaService: PrismaService) {}

  async create(dto: OrderCreateDto) {
    return await this.prismaService.$transaction(async (t) => {
      const bookings = await t.booking.findMany({
        where: {
          id: { in: dto.booking_ids },
          orderId: null,
          status: BookingStatus.confirmed,
        },
        include: { service: { select: { price: true } } },
      });

      console.log(bookings)
  
      if (!bookings.length)
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            title: "Ошибка заказа",
            detail: "Не удалось оформить заказ",
            meta: { bookings: dto.booking_ids },
          },
          HttpStatus.BAD_REQUEST,
        );
      
      const subtotal = bookings.reduce((s, b) => s + (b.service.price?.price ?? 0), 0);
      
      
      const order = await t.order.create({
        data: {
          status: "pending",
          subtotal,
          paymentMethod: dto.payment_method,
          bookings: { connect: bookings.map(b => ({ id: b.id })) }
        },
        select: {
          id: true,
          paymentMethod: true,
          status: true,
          subtotal: true,
          comment: true,
        }
      });

      await t.booking.updateMany({
        where: { id: { in: dto.booking_ids }, orderId: null },
        data: { orderId: order.id },
      });

      return order;
    });
  }

}
