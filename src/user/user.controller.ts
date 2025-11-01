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
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger/dist/decorators";
import { MeDto } from "./dto/me.dto";
import { UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { GlobalSuccessDto } from "src/shared/dto/global.dto";
import { UploadAvatarDto } from "src/shared/dto/file-uploaddto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @ApiOperation({ summary: "Инфо о профиле" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: MeDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get("me")
  getUser(@Authorized("id") userId: string) {
    return this.userService.findById(userId);
  }

  @Authorization()
  @ApiOperation({ summary: "Загрузить аватар" })
  @ApiBody({ type: UploadAvatarDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: GlobalSuccessDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @Post("user/avatar/:user_id")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.OK)
  upload(@UploadedFile() file: BufferedFile, @Param("user_id") userId: string) {
    return this.userService.uploadAvatar(file, userId);
  }
}
