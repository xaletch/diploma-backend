import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { buildFileUrl } from "src/shared/utils/build-url";

@Injectable()
export class CatalogService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCatalog(city?: string, cursor?: string, take = 20) {
    const companies = await this.prismaService.company.findMany({
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: {
        ...(city
          ? {
              locations: {
                some: {
                  active: true,
                  address: { city: { equals: city, mode: "insensitive" } },
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        logo: true,
        publicName: true,
        specialization: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
          },
        },
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
        locations: {
          where: { active: true },
          take: 1,
          select: {
            id: true,
            name: true,
            avatar: true,
            address: {
              select: {
                city: true,
                street: true,
                house: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const hasNextPage = companies.length > take;
    const items = hasNextPage ? companies.slice(0, -1) : companies;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      data: items.map((c) => ({
        id: c.id,
        name: c.name,
        logo: buildFileUrl(c.logo),
        public_name: c.publicName,
        specialization: c.specialization,
        industry: c.industry,
        location: c.locations[0]
          ? {
              ...c.locations[0],
              avatar: buildFileUrl(c.locations[0].avatar),
            }
          : null,
      })),
      next_cursor: nextCursor,
      has_next_page: hasNextPage,
    };
  }

  async search(
    query?: string,
    city?: string,
    cursor?: string,
    category?: string,
    take = 20,
  ) {
    const companies = await this.prismaService.company.findMany({
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      where: {
        ...(category
          ? {
              specialization: {
                tag: { equals: category, mode: "insensitive" },
              },
            }
          : {}),
        ...(city
          ? {
              locations: {
                some: {
                  active: true,
                  address: { city: { equals: city, mode: "insensitive" } },
                },
              },
            }
          : {}),
        ...(query?.trim()
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                {
                  services: {
                    some: {
                      OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        {
                          publicName: { contains: query, mode: "insensitive" },
                        },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        logo: true,
        publicName: true,
        specialization: {
          select: { id: true, name: true, icon: true },
        },
        locations: {
          where: { active: true },
          take: 1,
          select: {
            avatar: true,
            address: {
              select: { city: true, street: true, house: true },
            },
          },
        },
        services: {
          where: {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { publicName: { contains: query, mode: "insensitive" } },
            ],
          },
          take: 3,
          select: {
            id: true,
            name: true,
            avatar: true,
            publicName: true,
            price: { select: { price: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const hasNextPage = companies.length > take;
    const items = hasNextPage ? companies.slice(0, -1) : companies;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    return {
      data: items.map((c) => ({
        id: c.id,
        name: c.name,
        logo: buildFileUrl(c.logo),
        public_name: c.publicName,
        specialization: c.specialization,
        location: c.locations[0]
          ? {
              ...c.locations[0],
              avatar: buildFileUrl(c.locations[0].avatar),
            }
          : null,
        matched_services: c.services,
      })),
      next_cursor: nextCursor,
      has_next_page: hasNextPage,
    };
  }

  async getCompany(publicName: string) {
    const company = await this.prismaService.company.findUnique({
      where: { publicName },
      select: {
        id: true,
        name: true,
        publicName: true,
        logo: true,
        specialization: {
          select: { id: true, name: true, icon: true },
        },
        industry: {
          select: { id: true, name: true },
        },
        locations: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            description: true,
            phone: true,
            avatar: true,
            comfort: true,
            category: true,
            address: {
              select: {
                street: true,
                house: true,
                city: true,
                region: true,
                country: true,
                timezone: true,
                positionLat: true,
                positionLng: true,
              },
            },
          },
        },
        services: {
          select: {
            id: true,
            name: true,
            publicName: true,
            duration: true,
            avatar: true,
            category: true,
            mark: true,
            price: {
              select: { price: true },
            },
            discount: {
              select: { price: true },
            },
          },
        },
        users: {
          select: {
            id: true,
            phone: true,
            avatar: true,
            position: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!company)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          title: "Ошибка",
          detail: "Компания не найдена.",
        },
        HttpStatus.NOT_FOUND,
      );

    return {
      id: company.id,
      name: company.name,
      logo: buildFileUrl(company.logo),
      public_name: company.publicName,
      specialization: company.specialization,
      industry: company.industry,
      locations: company.locations.map((l) => ({
        ...l,
        avatar: buildFileUrl(l.avatar),
        address: {
          street: l.address?.street,
          house: l.address?.house,
          city: l.address?.city,
          region: l.address?.region,
          country: l.address?.country,
          timezone: l.address?.timezone,
          position: {
            lat: l.address?.positionLat,
            lng: l.address?.positionLng,
          },
          full_address: [l.address?.city, l.address?.street, l.address?.house]
            .filter(Boolean)
            .join(", "),
        },
      })),
      services: company.services.map((s) => ({
        id: s.id,
        name: s.name,
        public_name: s.publicName,
        avatar: buildFileUrl(s.avatar),
        duration: s.duration,
        category: s.category,
        mark: s.mark,
        price: s.price?.price,
        discount: s.discount?.price,
      })),
      employees: company.users.map((u) => ({
        id: u.id,
        phone: u.phone,
        avatar: buildFileUrl(u.avatar),
        full_name: `${u.firstName} ${u.lastName}`,
        first_name: u.firstName,
        last_name: u.lastName,
        position: u.position,
      })),
    };
  }
}
