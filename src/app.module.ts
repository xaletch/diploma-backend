import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { IS_DEV_ENV } from "./shared/utils/is-dev";
import { UserModule } from "./user/user.module";
import { ConfigurationService } from "./shared/configuration/configuration.service";
import { ConfigurationModule } from "./shared/configuration/configuration.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    ConfigurationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly _configurationService: ConfigurationService) {}
}
