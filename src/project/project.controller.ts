// import { Body, Controller, Get, Headers, Param, Post } from "@nestjs/common";
// import { ProjectService } from "./project.service";
// import { Authorization } from "src/auth/decorators/auth.decorator";
// import { ProjectDto } from "./dto/project.dto";
// import { Authorized } from "src/auth/decorators/authorized.decorator";
// import { ProjectWorkService } from "./project-work.service copy";
// import { ProjectWorkDto } from "./dto/work/work.dto";

// @Controller("project")
// export class ProjectController {
//   constructor(
//     private readonly projectService: ProjectService,
//     private readonly projectWorkService: ProjectWorkService,
//   ) {}

//   @Authorization()
//   @Post()
//   create(@Body() dto: ProjectDto, @Authorized("id") userId: string) {
//     return this.projectService.create(dto, userId);
//   }

//   @Authorization()
//   @Get("list")
//   findUserProject(@Authorized("id") userId: string) {
//     return this.projectService.findUserProject(userId);
//   }

//   @Authorization()
//   @Get("detail")
//   findById(
//     @Headers("project_id") id: string,
//     @Authorized("id") userId: string,
//   ) {
//     return this.projectService.findById(id, userId);
//   }

//   @Authorization()
//   @Post("work/admin/create")
//   createProjectWork(@Body() dto: ProjectWorkDto) {
//     return this.projectWorkService.createWork(dto);
//   }

//   @Authorization()
//   @Get("work")
//   getProjectWorks() {
//     return this.projectWorkService.getWorks();
//   }

//   @Authorization()
//   @Get("work/specialization/:work_id")
//   getWorkSpecializations(@Param("work_id") workId: string) {
//     return this.projectWorkService.getWorkSpecializations(workId);
//   }
// }
