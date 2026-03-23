import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { buildFileUrl } from "src/shared/utils/build-url";

@Injectable()
export class DirectoriesService {
  constructor(private readonly PrismaService: PrismaService) {}

  async employees(companyId: string) {
    const employees = await this.PrismaService.user.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        position: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return employees.map((emp) => ({
      id: emp.id,
      email: emp.email,
      first_name: emp.firstName,
      last_name: emp.lastName,
      avatar: buildFileUrl(emp.avatar),
      position: emp.position,
      role: emp.role,
    }));
  }

  async locations(companyId: string) {
    const locations = await this.PrismaService.location.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        avatar: true,
        active: true,
      },
    });

    return locations;
  }
}
