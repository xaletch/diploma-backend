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
import { slugify } from "transliteration";
import { BufferedFile } from "src/minio/file.model";
import { MinioService } from "src/minio/minio.service";
import { buildFileUrl } from "src/shared/utils/build-url";
import { UpdateCompanyDto } from "./dto/update.dto";

@Injectable()
export class CompanyService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
    private readonly minioService: MinioService,
  ) {}

  // улучшить переписав на prisma.$transaction
  async create(dto: CreateCompanyDto, userId: string) {
    const user = await this.userService.findById(userId);

    const isExists = await this.prismaService.company.findFirst({
      where: { users: { some: { id: userId } } },
    });

    if (isExists)
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          title: "Повторная попытка создания компании",
          description: "Вы уже создали компанию!",
          details: [
            "Одна компания может существовать только единожды в вашем профиле.",
            "Изменить данные существующей компании можно в соответствующем разделе",
          ],
          recommendations: [
            "Если возникли трудности, обратитесь в службу поддержки.",
          ],
        },
        HttpStatus.CONFLICT,
        { cause: new Error() },
      );

    const companyIsExist = await this.prismaService.company.findUnique({
      where: {
        publicName: slugify(dto.name, { lowercase: true, separator: "-" }),
      },
    });

    if (companyIsExist)
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          title: "Данное имя компании уже занято",
          recommendations: [
            "Если возникли трудности, обратитесь в службу поддержки.",
          ],
        },
        HttpStatus.CONFLICT,
      );

    const company = await this.prismaService.$transaction(async (t) => {
      const company = await t.company.create({
        data: {
          name: dto.name,
          publicName: slugify(dto.name, { lowercase: true, separator: "-" }),
          currency: dto.currency,
          specialization: { connect: { id: dto.specialization } },
          industry: { connect: { id: dto.industry } },
          users: { connect: { id: user.id } },
        },
        select: {
          id: true,
          name: true,
          currency: true,
        },
      });

      const locationData = {
        ...dto,
        name: company.name,
        phone: user.phone,
      };

      await this.locationService.createFirst(
        t,
        locationData,
        userId,
        user.role_id.id,
        company.id,
      );

      return company;
    });

    return company;
  }

  async findById(id: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id },
    });

    if (!company) throw new NotFoundException("Компания не найдена");

    return company;
  }

  async uploadLogo(image: BufferedFile, companyId: string) {
    const { logo } = await this.findById(companyId);
    const upload = await this.minioService.uploadFile(
      "company-avatars",
      image,
      logo || undefined,
    );

    const key = `company-avatars/${upload}`;

    await this.prismaService.company.update({
      where: { id: companyId },
      data: { logo: key },
    });
    return { success: true, avatar: buildFileUrl(key) };
  }

  async update(companyId: string, dto: UpdateCompanyDto) {
    const { id } = await this.findById(companyId);

    const { name, currency } = dto;

    const company = await this.prismaService.company.update({
      where: { id },
      data: {
        name,
        currency,
        /**
          =====!! ДОБАВИТЬ СМЕНУ ПУБЛИЧНОГО ИМЕНИ !!=====
        **/
        // publicName: slugify(name, { lowercase: true, separator: "-" }),
      },
      select: {
        id: true,
        name: true,
        publicName: true,
        logo: true,
        currency: true,
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
        specialization: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      id: company.id,
      name: company.name,
      logo: buildFileUrl(company.logo),
      site_url: `http://app.fast-day.ru/${company.publicName}`,
      currency: company.currency,
      industry: {
        id: company.industry.id,
        name: company.industry.name,
      },
      specialization: company.specialization.name,
    };
  }
}
