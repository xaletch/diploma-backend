import { Module } from "@nestjs/common";
import { CompanyService } from "./company.service";
import { CompanyController } from "./company.controller";
import { UserModule } from "src/user/user.module";
import { LocationModule } from "src/location/location.module";
import { SpecializationService } from "./specialization.service";

@Module({
  imports: [UserModule, LocationModule],
  controllers: [CompanyController],
  providers: [CompanyService, SpecializationService],
  exports: [CompanyService, SpecializationService],
})
export class CompanyModule {}
