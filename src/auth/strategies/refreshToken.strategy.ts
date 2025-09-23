// import { PassportStrategy } from "@nestjs/passport";
// import { ExtractJwt, Strategy } from "passport-jwt";
// import { Request } from "express";
// import { Injectable } from "@nestjs/common";
// import { jwtConstants } from "../constants/jwt.constant";

// export interface JwtPayload {
//   sub: string;
//   phone: string;
// }

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor() {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret,
//     });
//   }

//   // eslint-disable-next-line @typescript-eslint/require-await
//   async validate(payload: JwtPayload) {
//     return {
//       id: payload.sub,
//       phone: payload.phone,
//     };
//   }
// }
