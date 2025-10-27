import { BookingStatus } from "@prisma/client";

export interface BookingCreate {
  id: string;
  name: string;
  status: BookingStatus;
}
