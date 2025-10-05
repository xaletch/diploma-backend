import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

  // улучшить переписав на prisma.$transaction
  async create(dto: CreateCompanyDto, userId: string) {
    const user = await this.userService.findById(userId);

    const isExists = await this.prismaService.company.findUnique({
      where: { userId: user.id },
    });

    if (isExists)
      throw new HttpException(
        { status: HttpStatus.CONFLICT, error: "Компания уже существует" },
        HttpStatus.CONFLICT,
        { cause: new Error() },
      );

    const company = await this.prismaService.company.create({
      data: {
        user: { connect: { id: user.id } },
        name: dto.name,
        currency: dto.currency,
        specialization: { connect: { id: dto.specialization } },
        industry: { connect: { id: dto.industry } },
      },
      select: {
        id: true,
        name: true,
        currency: true,
        user: {
          select: { id: true, phone: true, email: true },
        },
      },
    });

    const locationData = {
      ...dto,
      name: company.name,
      phone: user.phone,
    };

    await this.locationService.create(locationData, company.id);

    return company;
  }

  async findById(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });

    if (!company) throw new NotFoundException("Компания не найдена");

    return company;
  }
}
