import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UpdatePagesDto } from "./dto/page.dto";

@Injectable()
export class SettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  public async createSetting(userId: string) {
    await this.prismaService.settings.create({
      data: { userId },
    });
  }

  private async findById(userId: string) {
    const setting = await this.prismaService.settings.findUnique({
      where: { userId },
      select: { id: true },
    });

    return setting;
  }

  public async pageVisible(dto: UpdatePagesDto, userId: string) {
    const settings = await this.findById(userId);

    if (!settings) return;

    const pages = await Promise.all(
      dto.pages.map(({ page, is_visible }) =>
        this.prismaService.pageVisibility.upsert({
          where: {
            settingsId_page: {
              settingsId: settings?.id,
              page,
            },
          },
          update: { isVisible: is_visible },
          create: {
            settingsId: settings?.id,
            page,
            isVisible: is_visible,
          },
          select: {
            page: true,
            isVisible: true,
          },
        }),
      ),
    );

    return pages.map((p) => ({ page: p.page, is_visible: p.isVisible }));
  }
}
