import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

const ENV = process.env.NODE_ENV;
const envPath = ENV ? `.env.${ENV}` : '.env';
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envPath,
            isGlobal: true
        }),
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
