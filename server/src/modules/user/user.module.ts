import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [JwtModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}