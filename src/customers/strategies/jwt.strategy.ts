import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { CustomerTokenService } from "../token/token.service";
import { ConfigurationService } from "src/shared/configuration/configuration.service";
import { type CustomerJwtPayload } from "../types/jwt.payload";

@Injectable()
export class JwtCustomerStrategy extends PassportStrategy(
  Strategy,
  "jwt_customer",
) {
  constructor(
    private readonly tokenService: CustomerTokenService,
    configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("access_token"),
      ]),
      secretOrKey: configurationService.JWT.CustomerKey,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: CustomerJwtPayload) {
    const result = await this.tokenService.validatePayload(payload);
    req.user = result;
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
