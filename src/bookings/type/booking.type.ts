export type IBookingsCustomer = {
  id: string;
  phone: string;
  name: string;
};

export type IBookingsEmployee = {
  id: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  position: string | null;
};
