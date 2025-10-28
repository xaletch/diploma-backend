export type IBookingCustomer = {
  id: string;
  phone: string;
  name: string;
};

export type IBookingEmployee = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  position: string | null;
};
