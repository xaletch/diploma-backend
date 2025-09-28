import { Module } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { UserModule } from "src/user/user.module";
import { ProjectWorkService } from "./project-work.service copy";

@Module({
  imports: [UserModule],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectWorkService],
  exports: [ProjectWorkService],
})
export class ProjectModule {}
