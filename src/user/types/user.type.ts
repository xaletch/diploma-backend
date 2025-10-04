import { ROLE } from "@prisma/client";

export type IUser = {
  id: string;
  email: string;
  companyId: string | null;
  passwordHash: string;
  phone: string;
  firstName: string;
  lastName: string | null;
  role: ROLE;
};

export type IUserPrivate = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  full_name: string;
  role: ROLE;
  company: {
    id?: string;
    name?: string;
  } | null;
};
