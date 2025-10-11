import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesController } from "./services.controller";
import { CompanyModule } from "src/company/company.module";

@Module({
  imports: [CompanyModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
