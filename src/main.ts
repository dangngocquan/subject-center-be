import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { AppModule } from './app.module';

function setGlobalPrefix(app: INestApplication<any>, logger: Logger) {
  logger.debug(`[setGlobalPrefix] Start set global prefix ...`);
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  logger.debug(`[setGlobalPrefix] Finish set global prefix.`);
}

function setCors(app: INestApplication<any>, logger: Logger) {
  logger.debug(`[setCors] Start set cors...`);
  app.enableCors({
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, X-Telegram-Uid, Content-Type, Accept, Observe, Token, Lang, Token-Secret, Api-Key-User, Api-Key-Admin',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  logger.debug(`[setCors] Finish set cors.`);
}

function setSwagger(app: INestApplication<any>, logger: Logger) {
  logger.debug(`[setSwagger] Start set swagger ...`);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);
  logger.debug(`[setSwagger] Finish set swagger.`);
}

async function setStaticSwagger(app: INestApplication<any>, logger: Logger) {
  // get the swagger json file (if app is running in development mode)
  if (process.env.NODE_ENV === 'development') {
    const serverUrl = await app.getUrl();
    // write swagger ui files
    get(`${serverUrl}/docs/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      logger.log(
        `Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`,
      );
    });

    get(`${serverUrl}/docs/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      logger.log(
        `Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`,
      );
    });

    get(
      `${serverUrl}/docs/swagger-ui-standalone-preset.js`,
      function (response) {
        response.pipe(
          createWriteStream('swagger-static/swagger-ui-standalone-preset.js'),
        );
        logger.log(
          `Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`,
        );
      },
    );

    get(`${serverUrl}/docs/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      logger.log(
        `Swagger UI css file written to: '/swagger-static/swagger-ui.css'`,
      );
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
    rawBody: true,
  });
  const logger = new Logger('MAIN');

  setGlobalPrefix(app, logger);
  setCors(app, logger);
  setSwagger(app, logger);

  const port = process.env.APP_PORT;
  await app.listen(port);

  logger.log(`[PROCESS] ${process.env.PROCESS}`);

  logger.log(`[PORT] Running on port ${port}`);
  logger.log(`[DOCS] Documentation: http://localhost:${port}/docs`);

  await setStaticSwagger(app, logger);
}

bootstrap();
