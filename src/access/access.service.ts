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
    const location = await this.prismaService.userLocation.findFirst({
      where: { userId: user.id, locationId: location_id },
    });

    if (!location) throw new NotFoundException("Локация не найдена");

    return !!location;
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
