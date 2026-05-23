import { Global, Module } from "@nestjs/common";
import { MailService } from "./mail.service";
import { HttpModule } from "@nestjs/axios";

@Global()
@Module({
  imports: [HttpModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
