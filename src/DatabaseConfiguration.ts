import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
  return {
    type: "postgres",
    autoLoadEntities: true,
    synchronize: true,
    host: configService.get("DB_HOST"),
    port: configService.get("DB_PORT"),
    username: configService.get("DB_USERNAME"),
    password: configService.get("DB_PASSWORD"),
    database: configService.get("DB_DATABASE")  as string
  }
}
