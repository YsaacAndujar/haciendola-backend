import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as dotenv from 'dotenv'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  dotenv.config()

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  })
  
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  )
  
  const config = new DocumentBuilder()
    .setTitle(process.env.API_NAME)
    .setDescription('Backend - Haciendola')
    .setVersion(process.env.API_VERSION)
    .addBearerAuth()
    .build()
    
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
  
    await app.listen(process.env.PORT, () => {
      console.log(`Server is listening on port ${process.env.PORT}`)
    })
    
}
bootstrap();
