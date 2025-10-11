import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenService } from "../token/token.service";
import { JwtPayload } from "../jwt.payload";
import { ConfigurationService } from "src/shared/configuration/configuration.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly tokenService: TokenService,
    configurationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("access_token"),
      ]),
      secretOrKey: configurationService.JWT.Key,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    const result = await this.tokenService.validatePayload(payload);
    req.user = result;
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}
