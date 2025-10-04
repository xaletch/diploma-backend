import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "src/user/user.service";
import { CreateCompanyDto } from "./dto/create.dto";
import { LocationService } from "src/location/location.service";

@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
  ) {}

  async create(dto: CreateCompanyDto, userId: string) {
    const user = await this.userService.findById(userId);

    const company = await this.prismaService.company.create({
      data: {
        user: { connect: { id: user.id } },
        name: dto.name,
        currency: dto.currency,
      },
    });

    const locationData = {
      name: company.name,
      phone: user.phone,
    };

    const location = await this.locationService.create(
      locationData,
      company.id,
    );

    return { company, location };
  }

  async findById(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });

    if (!company) throw new NotFoundException("Компания не найдена");

    return company;
  }
}
