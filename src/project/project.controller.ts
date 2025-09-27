import { Body, Controller, Post } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { ProjectDto } from "./dto/project.dto";
import { Authorized } from "src/auth/decorators/authorized.decorator";

@Controller("project")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Authorization()
  @Post()
  create(@Body() dto: ProjectDto, @Authorized("id") userId: string) {
    return this.projectService.create(dto, userId);
  }
}
