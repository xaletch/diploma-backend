import { CURRENCY, ROLE } from "@prisma/client";

export type IUser = {
  id: string;
  email: string;
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
  name: string;
  role: ROLE;
  company: {
    id?: string;
    name?: string;
    currency?: CURRENCY;
    industry?: { id: number; name: string };
    specialization?: string;
  } | null;
  locations?: {
    id: string;
    name: string;
    phone: string;
    company_name: string;
    currency: CURRENCY;
    country?: string;
  }[];
};
