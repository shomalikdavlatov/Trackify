import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true, // 👈 makes it global
            envFilePath: '.env', // optional, default is .env
        }),
    ],
    exports: [DatabaseModule],
})
export class CoreModule {}