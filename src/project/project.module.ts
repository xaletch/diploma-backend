import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { UserModule } from "src/user/user.module";

@Module({
  imports: [UserModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
