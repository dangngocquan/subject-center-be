import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import serverless from 'serverless-http';

function setGlobalPrefix(app: INestApplication<any>, logger: Logger) {
  logger.debug(`[setGlobalPrefix] Start setting global prefix ...`);
  app.setGlobalPrefix('api', { exclude: ['/'] });
  logger.debug(`[setGlobalPrefix] Finish setting global prefix.`);
}

function setCors(app: INestApplication<any>, logger: Logger) {
  logger.debug(`[setCors] Start setting CORS ...`);
  app.enableCors({
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, X-Telegram-Uid, Content-Type, Accept, Observe, Token, Lang, Token-Secret, Api-Key-User, Api-Key-Admin',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  logger.debug(`[setCors] Finish setting CORS.`);
}

function setSwagger(app: INestApplication<any>, logger: Logger) {
  logger.debug(`[setSwagger] Start setting Swagger ...`);
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);
  logger.debug(`[setSwagger] Finish setting Swagger.`);
}

async function bootstrap(): Promise<INestApplication | any> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    bufferLogs: true,
    rawBody: true,
  });

  const logger = new Logger('MAIN');
  setGlobalPrefix(app, logger);
  setCors(app, logger);
  setSwagger(app, logger);

  return handleEnvironment(app, logger);
}

async function handleEnvironment(app: INestApplication, logger: Logger) {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = process.env.APP_PORT || 3000;

  switch (nodeEnv) {
    case 'development':
      logger.log(`[ENV] Running in Development Mode`);
      await app.listen(port);
      logger.log(`[PORT] Server running on http://localhost:${port}`);
      logger.log(`[DOCS] Swagger available at http://localhost:${port}/docs`);
      break;

    case 'production':
      logger.log(`[ENV] Running in Production Mode (Vercel)`);
      await app.init(); // Use `init()` for serverless
      const expressApp = app.getHttpAdapter().getInstance();
      return serverless(expressApp);

    default:
      logger.warn(`[ENV] Unknown environment: ${nodeEnv}. Falling back to Development Mode.`);
      await app.listen(port);
      logger.log(`[PORT] Server running on http://localhost:${port}`);
      break;
  }
}

if (process.env.NODE_ENV !== 'production') {
  bootstrap();
}

export const handler = async (event: any, context: any) => {
  const server = await bootstrap();
  return server(event, context);
};

export default handler;
