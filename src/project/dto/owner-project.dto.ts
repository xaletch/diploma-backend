import { UserRole } from "@prisma/client";
import { IsString } from "class-validator";

export class OwnerProjectDto {
  @IsString()
  userId: string;

  @IsString()
  projectId: string;

  @IsString()
  role: UserRole;
}
