import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { TokenService } from "./token/token.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./jwt.payload";
import { AuthPromise } from "./types/auth.type";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}

  // new auth
  async register(dto: RegisterDto, ipAddress: string): Promise<AuthPromise> {
    const isExist = await this.userService.findByEmailOptional(dto.email);

    if (isExist)
      throw new ConflictException("Пользователь уже зарегистрирован");

    const user = await this.userService.create({ ...dto }, "active");
    const payload = { sub: user.id, email: user.email } satisfies JwtPayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refreshToken = await this.tokenService.createRefreshToken({
      userId: payload.sub,
      ipAddress,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async login(dto: LoginDto, ipAddress: string): Promise<AuthPromise> {
    const { passwordHash, id, email } = await this.userService.findByEmail(
      dto.email,
    );

    if (!passwordHash) throw new NotFoundException("Не зарегистрирован");

    const isValidate = await this.userService.comparePassword(
      dto.password,
      passwordHash,
    );

    if (!isValidate) throw new NotFoundException("Неверный логин или пароль");

    const payload = { sub: id, email } satisfies JwtPayload;
    const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refreshToken = await this.tokenService.createRefreshToken({
      userId: payload.sub,
      ipAddress,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  // old auth
  // async sendCode(dto: AuthPhoneDto) {
  //   const { phone } = dto;

  //   let user = await this.userService.findByPhone(phone);
  //   if (!user) {
  //     user = await this.userService.createUser(phone);
  //   }

  //   return { phone };
  // }

  // async verifyCode(dto: AuthVerifyDto, ipAddress: string) {
  //   const { code, phone } = dto;
  //   if (code !== "1234") throw new UnauthorizedException("Неверный код");

  //   let user = await this.userService.findByPhone(phone);
  //   if (!user) {
  //     user = await this.userService.createUser(phone);
  //   }
  //   if (user.status !== "active") {
  //     user = await this.userService.updateUserStatus(user.id, "active");
  //   }

  //   const payload = { sub: user.id, phone: user.phone };
  //   const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });

  //   const refreshToken = await this.tokenService.createRefreshToken({
  //     userId: user.id,
  //     ipAddress,
  //   });

  //   return { access_token: accessToken, refresh_token: refreshToken };
  // }

  async refreshTokens(
    refresh_token: string,
    old_token: string,
    ipAddress: string,
  ) {
    try {
      return this.tokenService.getAccessTokenFromRefreshToken(
        refresh_token,
        old_token,
        ipAddress,
      );
    } catch (err) {
      console.error(`Не удалось обновить токен ${err}`);
      throw new UnauthorizedException("Не удалось обновить токен");
    }
  }
}
