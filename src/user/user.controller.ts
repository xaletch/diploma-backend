import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/minio/file.model";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @HttpCode(HttpStatus.OK)
  @Get("me")
  getUser(@Authorized("id") userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization()
  @Post("user/avatar/:user_id")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.OK)
  upload(@UploadedFile() file: BufferedFile, @Param("user_id") userId: string) {
    return this.userService.uploadAvatar(file, userId);
  }
}
