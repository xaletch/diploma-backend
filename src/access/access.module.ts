import { Global, Module } from "@nestjs/common";
import { AccessService } from "./access.service";
import { AccessController } from "./access.controller";
import { UserModule } from "src/user/user.module";

@Global()
@Module({
  imports: [UserModule],
  controllers: [AccessController],
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
