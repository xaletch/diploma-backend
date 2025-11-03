import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { TokenService } from "./token/token.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./jwt.payload";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
  ) {}
  async register(
    dto: RegisterDto,
    ipAddress: string,
  ): Promise<AuthResponseDto> {
    const isExist = await this.userService.findByEmailOptional(dto.email);

    if (isExist)
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          title: "Ошибка регистрации",
          detail: "Пользователь с таким email уже зарегистрирован",
        },
        HttpStatus.CONFLICT,
      );

    const user = await this.userService.create({ ...dto }, "active");
    const payload = { sub: user.id, email: user.email } satisfies JwtPayload;

    const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refreshToken = await this.tokenService.createRefreshToken({
      userId: payload.sub,
      ipAddress,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async login(dto: LoginDto, ipAddress: string): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(dto.email);

    const fakeHash: string = "$2b$08$Bgv6lWc0qHRKX32jclWsMbG3.6g2O";
    const passHashCheck = user ? user.passwordHash : fakeHash;

    const isValidate = await this.userService.comparePassword(
      dto.password,
      passHashCheck,
    );

    if (!user || !isValidate)
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          title: "Ошибка авторизации",
          detail: "Неверный логин или пароль",
        },
        HttpStatus.UNAUTHORIZED,
      );

    const payload = { sub: user.id, email: user.email } satisfies JwtPayload;
    const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
    const refreshToken = await this.tokenService.createRefreshToken({
      userId: payload.sub,
      ipAddress,
    });

    return { access_token: accessToken, refresh_token: refreshToken };
  }

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
