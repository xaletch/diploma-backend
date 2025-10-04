import { Module } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { UserModule } from "src/user/user.module";
import { LocationModule } from "src/location/location.module";

@Module({
  imports: [UserModule, LocationModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
