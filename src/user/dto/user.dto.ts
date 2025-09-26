import { UserRole } from "./role.type";

export class UserCreateDto {
  name: string;
  login: string;
  password: string;
  role: UserRole;
}
