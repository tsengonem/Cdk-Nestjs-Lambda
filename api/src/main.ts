import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { Express } from 'express';
import { Server } from 'http';
import { Context } from 'aws-lambda';
import { createServer, proxy, Response } from 'aws-serverless-express';
import express from 'express';

export async function createApp(
    expressApp: Express
): Promise<INestApplication> {
    const app = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp)
    );
    app.enableCors();
    return app;
}

let cachedServer: Server;

function setupSwagger(app: INestApplication, isLambda: boolean) {
    const options = new DocumentBuilder()
              .setTitle('Lambda API')
              .setDescription('Lambda REST API documentation')
              .setVersion('1.0.0')
              .addTag('Lambda')
              .build()
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
}

async function bootstrap(): Promise<Server> {
    const expressApp = express();

    const app = await createApp(expressApp);
    // for apigateway stageName
    setupSwagger(app, true);
    await app.init();

    return createServer(expressApp);
}

export async function handler(event: any, context: Context): Promise<Response> {
    try{
        if (event.path === '/docs') {
            event.path = '/docs/';
        }
        event.path = event.path.includes('swagger-ui')
            ? `/docs${event.path}`
            : event.path;
        if (!cachedServer) {
            cachedServer = await bootstrap();
        }

        return proxy(cachedServer, event, context, 'PROMISE').promise;
    }catch(err){
        console.error(`errors: ${err}`);
    }
}

async function bootstrap_local() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    setupSwagger(app, false);
    await app.listen(3000);
}
bootstrap_local();
