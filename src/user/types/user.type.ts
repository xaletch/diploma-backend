import { CURRENCY, UserStatus } from "@prisma/client";
import { IRole } from "src/role/types/role.type";

export type IUser = {
  id: string;
  email: string;
  passwordHash: string | null;
  phone: string;
  firstName: string;
  lastName: string | null;
  roleId: number | null;
  status: UserStatus;
};

export type IUserPrivate = {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string | null;
  name: string;
  roleId: number | null;
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

export type UserPrivate = {
  id: string;
  email: string;
  role: IRole | null;
  company: { id: string } | null;
  companyId: string | null;
  permissions: { name: string }[] | null;
};
