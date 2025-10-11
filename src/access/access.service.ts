import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserPrivate } from "src/user/types/user.type";

@Injectable()
export class AccessService {
  constructor(private readonly prismaService: PrismaService) {}

  async accessLocation(
    user: UserPrivate,
    location_id: string,
  ): Promise<boolean> {
    if (user.role?.name === "owner") {
      const location = await this.prismaService.location.findUnique({
        where: { id: location_id },
        select: { companyId: true },
      });

      return location?.companyId === user.company?.id;
    } else {
      const userLocation = await this.prismaService.userLocation.findFirst({
        where: { userId: user.id, locationId: location_id },
      });
      return !!userLocation;
    }
  }

  async accessCompany(user: UserPrivate, company_id): Promise<boolean> {
    if (user.role?.name === "owner") {
      const company = await this.prismaService.company.findUnique({
        where: { id: company_id },
        select: { userId: true },
      });

      if (!company) throw new NotFoundException("Компания не найдена");

      return company?.userId === user.id;
    }

    return false;
  }
}
