import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ["1"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>("ALLOWED_ORIGINS").split(","),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    exposedHeaders: ["Content-Type", "Authorization", "set-cookie"],
    allowedHeaders: ["Content-Type", "Authorization", "set-cookie"],
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
