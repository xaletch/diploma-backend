import { BookingStatus } from "@prisma/client";
import { IBookingsCustomer, IBookingsEmployee } from "./booking.type";

export type IBookings = {
  id: string;
  name: string;
  status: BookingStatus;
  start_time: string;
  end_time: string;
  date: string;
  comment: string | null;
  customer: IBookingsCustomer;
  employee: IBookingsEmployee;
};

export type IBookingDetailsLocation = {
  id: string;
  name: string;
};

export type IBookingDetailsCustomer = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  email: string | null;
  birthday: string | null;
};

export type IBookingDetailsEmployee = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string;
};

interface IBookingDetailsService {
  id: string;
  name: string;
  duration: number;
  prices: {
    price?: number | null;
    cost_price?: number | null;
  };
}

export type IBookingDetails = {
  id: string;
  name: string;
  status: BookingStatus;
  start_time: string;
  end_time: string;
  date: string;
  comment: string | null;
  location: IBookingDetailsLocation;
  customer: IBookingDetailsCustomer;
  employee: IBookingDetailsEmployee;
  service: IBookingDetailsService;
};
