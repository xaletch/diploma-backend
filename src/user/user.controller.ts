import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { Authorization } from "src/auth/decorators/auth.decorator";
import { Authorized } from "src/auth/decorators/authorized.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "src/minio/file.model";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger/dist/decorators";
import { MeDto } from "./dto/me.dto";
import { NotFoundDto, UnAuthorizedDto } from "src/shared/dto/errors.dto";
import { GlobalSuccessDto } from "src/shared/dto/global.dto";
import { UploadAvatarDto } from "src/shared/dto/file-uploaddto";
import { UserDetailDto } from "./dto/user.dto";
import { AuthGuard } from "src/auth/guard/auth.guard";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @ApiBearerAuth()
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

  // РАЗОБРАТЬСЯ С КОМПАНИЕЙ И ДОСТУПАМИ !!!
  @ApiBearerAuth()
  @ApiOperation({ summary: "Получить пользователя по email" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "success",
    type: UserDetailDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "unauthorized",
    type: UnAuthorizedDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @Get("user/:email")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  getByEmail(@Req() req, @Param("email") email: string) {
    const companyId = req.user.companyId;
    return this.userService.findUserByEmil(email, companyId);
  }

  @Authorization()
  @ApiBearerAuth()
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "not found",
    type: NotFoundDto,
  })
  @Post("user/avatar/:user_id")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.OK)
  upload(@UploadedFile() file: BufferedFile, @Param("user_id") userId: string) {
    return this.userService.uploadAvatar(file, userId);
  }
}
