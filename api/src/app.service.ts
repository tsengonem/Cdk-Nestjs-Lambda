import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
    constructor(
        private readonly configService: ConfigService
    ) {}
    getHello() {
        return {
            message: 'Hello world! Nest',
            env: this.configService.get('APIGATEWAY_STAGE')
        };
    }
}
