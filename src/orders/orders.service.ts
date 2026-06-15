/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderCreateDto } from './dto/order-create.dto';
import { BookingStatus, Prisma } from '@prisma/client';
import { generateOrderTag } from './utils/generate-order-tag';
import { buildPaginatedResponse, getPaginationParams } from 'src/shared/common/pagination/pagination';
import { GetOrdersDto, OrderSortOrder } from './dto/get-orders.dto';

@Injectable()
export class OrdersService {
  public constructor(private readonly prismaService: PrismaService) {}

  async create(dto: OrderCreateDto, companyId: string) {
    return await this.prismaService.$transaction(async (t) => {
      const bookings = await t.booking.findMany({
        where: {
          id: { in: dto.booking_ids },
          orderId: null,
          status: BookingStatus.confirmed,
        },
        include: { service: { select: { price: true } } },
      });
  
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
          status: dto.status ?? "pending",
          subtotal,
          tag: generateOrderTag(),
          companyId,
          paymentMethod: dto.payment_method ?? null,
          bookings: { connect: bookings.map(b => ({ id: b.id })) }
        },
        select: {
          id: true,
          tag: true,
          paymentMethod: true,
          status: true,
          total: true,
          subtotal: true,
          comment: true,
        }
      });

      await t.booking.updateMany({
        where: { id: { in: dto.booking_ids }, orderId: null },
        data: { orderId: order.id },
      });

      return {
        id: order.id,
        tag: order.tag,
        status: order.status,
        payment_method: order.paymentMethod,
        total: order.total,
        subtotal: order.subtotal,
        comment: order.comment ?? null,
      };
    });
  }

  async getAll(companyId: string,  query: GetOrdersDto) {
    const { status, sort, ...pagination } = query;
    const { page, limit, skip } = getPaginationParams(pagination);

    const where = {
      companyId,
      ...(status && { status }),
    }

  const orderBy: Prisma.OrderOrderByWithRelationInput =
    sort === OrderSortOrder.OLDEST
      ? { createdAt: "asc" }
      : sort === OrderSortOrder.PRICE_ASC
        ? { total: "asc" }
        : sort === OrderSortOrder.PRICE_DESC
          ? { total: "desc" }
          : { createdAt: "desc" };

    const [orders, total] = await Promise.all([
      this.prismaService.order.findMany({
        where,
        select: {
          id: true,
          status: true,
          subtotal: true,
          total: true,
          paymentMethod: true,
          paidAt: true,
        },
        orderBy,
        skip,
        take: limit,
      }),
      this.prismaService.order.count({ where }),
    ]);

    const data = orders.map((ord) => ({
      id: ord.id,
      status: ord.status,
      subtotal: ord.subtotal,
      total: ord.total,
      payment_method: ord.paymentMethod,
      is_payment: !ord.paidAt,
    }));

    return buildPaginatedResponse(data, total, page, limit);
  }

  async details(orderId: string) {
    const order = await this.prismaService.order.findFirst({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        subtotal: true,
        total: true,
        paymentMethod: true,
        paidAt: true,
        comment: true,
        bookings: {
          select: {
            id: true,
            status: true,
            startTime: true,
            endTime: true,
            tag: true,
            date: true,
            comment: true,
            employee: {
              select: {
                id: true,
                firstName: true,
                avatar: true,
                email: true,
                lastName: true,
                phone: true,
              }
            },
            service: {
              select: {
                id: true,
                name: true,
                category: true,
                avatar: true,
              },
            },
            customer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true,
                avatar: true,
                account: {
                  select: {
                    id: true,
                  }
                }
              },
            },
          },
        },
      }
    });

    if (!order)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Заказ не найден.",
          meta: { order_id: orderId },
        },
        HttpStatus.NOT_FOUND,
      );

    return {
      id: order.id,
      status: order.status,
      subtotal: order.subtotal,
      total: order.total,
      payment_method: order.paymentMethod,
      is_payment: order.paidAt,
      bookings: order.bookings,
    }
  }

}
