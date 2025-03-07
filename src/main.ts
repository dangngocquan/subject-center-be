import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

async function initServices(app: INestApplication) {
  // await app.select(TelegramBotModule).get(TelegramBotService).setupWebhook();
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
  await initServices(app);

  // logger.log(`[PROCESS] ${process.env.PROCESS}`);

  logger.log(`[PORT] Running on port ${port}`);
  logger.log(`[DOCS] Documentation: http://localhost:${port}/docs`);
}
bootstrap();
