import { Global, Module } from "@nestjs/common";
import { MinioService } from "./minio.service";
import { MinioController } from "./minio.controller";

@Global()
@Module({
  controllers: [MinioController],
  providers: [MinioService],
  exports: [MinioService],
})
export class MinioModule {}
