import { BookingStatus } from "@prisma/client";

export interface BookingById {
  id: string;
  name: string;
  status: BookingStatus;
}
