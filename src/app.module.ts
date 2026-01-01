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
import { CompanyModule } from "./company/company.module";
import { LocationModule } from "./location/location.module";
import { AddressModule } from "./address/address.module";
import { EmployeeModule } from "./employee/employee.module";
import { RoleModule } from "./role/role.module";
import { AccessModule } from "./access/access.module";
import { ServicesModule } from "./services/services.module";
import { RedisModule } from "./redis/redis.module";
import { CustomersModule } from "./customers/customers.module";
import { ScheduleModule } from "./schedule/schedule.module";
import { BookingsModule } from "./bookings/bookings.module";
import { MinioModule } from "./minio/minio.module";
import { OrdersModule } from "./orders/orders.module";

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
    CompanyModule,
    LocationModule,
    AddressModule,
    EmployeeModule,
    RoleModule,
    AccessModule,
    ServicesModule,
    RedisModule,
    CustomersModule,
    ScheduleModule,
    BookingsModule,
    MinioModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly _configurationService: ConfigurationService) {}
}
