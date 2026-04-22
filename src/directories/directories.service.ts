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

  async locationEmployees(locationId: string) {
    const employees = await this.PrismaService.userLocation.findMany({
      where: { locationId, isBanned: false },
      select: {
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            position: true,
          },
        },
      },
    });

    return employees.map((emp) => ({
      id: emp.user.id,
      email: emp.user.email,
      first_name: emp.user.firstName,
      last_name: emp.user.lastName,
      avatar: buildFileUrl(emp.user.avatar),
      position: emp.user.position,
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
        address: true,
      },
    });

    return locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      avatar: buildFileUrl(loc.avatar),
      active: loc.active,
      address: [
        loc.address?.country,
        loc.address?.region,
        loc.address?.city,
        loc.address?.street,
        loc.address?.house,
      ]
        .filter(Boolean)
        .join(", "),
    }));
  }

  async services(companyId: string) {
    const services = await this.PrismaService.service.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        type: true,
        mark: true,
        publicName: true,
      },
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      mark: service.mark,
      public_name: service.publicName,
    }));
  }

  async locationServices(locationId: string) {
    const services = await this.PrismaService.locationService.findMany({
      where: { locationId },
      select: {
        service: {
          select: {
            id: true,
            name: true,
            type: true,
            mark: true,
            publicName: true,
          },
        },
      },
    });

    return services.map((service) => ({
      id: service.service.id,
      name: service.service.name,
      mark: service.service.mark,
      public_name: service.service.publicName,
    }));
  }
}
