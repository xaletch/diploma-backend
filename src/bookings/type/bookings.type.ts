import { BookingStatus } from "@prisma/client";
import { IBookingCustomer, IBookingEmployee } from "./booking.type";

export type IBookings = {
  id: string;
  name: string;
  status: BookingStatus;
  start_time: string;
  end_time: string;
  comment: string | null;
  customer: IBookingCustomer;
  employee: IBookingEmployee;
};
