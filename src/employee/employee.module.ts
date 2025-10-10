import { Module } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { UserModule } from "src/user/user.module";
import { LocationModule } from "src/location/location.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthModule } from "src/auth/auth.module";
import { RoleModule } from "src/role/role.module";

@Module({
  imports: [
    UserModule,
    LocationModule,
    AuthModule,
    RoleModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
