import { Injectable, UnauthorizedException } from "@nestjs/common";
import { randomBytes } from "crypto";
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../jwt.payload";

@Injectable()
export class TokenService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  private refreshTokenTtl: number = 30;

  async getAccessTokenFromRefreshToken(
    refresh_token: string,
    old_token: string,
    ipAddress: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const token = await this.prismaService.session.findFirst({
        where: { token: refresh_token },
      });
      const currentDate = new Date();

      if (!token) throw new Error("Токен не найден");
      if (token?.expiresAt < currentDate)
        throw new Error("Срок действия токена истек");

      if (token.ipAddress !== ipAddress) throw new Error("IP не совпадает");

      const oldPayload = await this.validateToken(old_token, true);
      const payload: JwtPayload = {
        sub: oldPayload.sub,
        email: oldPayload.email,
      };

      const accessToken = await this.createAccessToken(payload);
      await this.prismaService.session.delete({ where: { id: token.id } });
      const newRefreshToken = await this.createRefreshToken({
        userId: oldPayload.sub,
        ipAddress,
      });

      return { access_token: accessToken, refresh_token: newRefreshToken };
    } catch (err) {
      console.error(`Не удалось обновить токен ${err}`);
      throw new UnauthorizedException("Не удалось обновить токен");
    }
  }

  async createRefreshToken(data: {
    userId: string;
    ipAddress: string;
  }): Promise<string> {
    const { userId, ipAddress } = data;

    const refreshToken = randomBytes(64).toString("hex");

    await this.prismaService.session.create({
      data: {
        token: refreshToken,
        userId: userId,
        ipAddress: ipAddress,

        expiresAt: new Date(
          Date.now() + this.refreshTokenTtl * 24 * 60 * 60 * 1000,
        ),
      },
    });

    return refreshToken;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  private async createAccessToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload, { expiresIn: "1h" });
  }

  private async validateToken(
    token: string,
    ignoreExpiration = false,
  ): Promise<JwtPayload> {
    return this.jwtService.verify(token, {
      secret: process.env.JWT_ACCESS_SECRET,
      ignoreExpiration,
    });
  }

  async validatePayload(
    payload: JwtPayload,
  ): Promise<{ id: string; email: string } | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) return null;

    return { id: user.id, email: user.phone };
  }
}
