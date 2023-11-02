import { Module } from '@nestjs/common';
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        JwtModule.register({
            secret: 'your_secret_key',
            signOptions: { expiresIn: '1h' },
        }),
    ],
    controllers: [AuthController],
})
export class AuthModule {}
