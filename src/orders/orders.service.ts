/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderCreateDto } from './dto/order-create.dto';

@Injectable()
export class OrdersService {
  public constructor(private readonly prismaService: PrismaService) {}

  async create(dto: OrderCreateDto) {
    const bookings = await this.prismaService.booking.findMany({
      where: {
        id: { in: dto.booking_ids },
        orderId: null,
        status: "confirmed",
      },
      include: { service: { select: { price: true } } },
    });
    
    const subtotal = bookings.reduce((s, b) => s + (b.service.price?.price ?? 0), 0);
    
    await this.prismaService.$transaction(async (t) => {
      const order = await t.order.create({
        data: {
          status: "pending",
          subtotal,
          paymentMethod: dto.payment_method,
          bookings: { connect: bookings.map(b => ({ id: b.id })) }
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
