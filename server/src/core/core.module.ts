import { Global, Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
    imports: [
        DatabaseModule,
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
    ],
    exports: [DatabaseModule],
})
export class CoreModule {}