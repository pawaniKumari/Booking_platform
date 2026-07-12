import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //Enable Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable Global Validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Set Global Prefix
  app.setGlobalPrefix('api');

  // Swagger Configurations
  const config = new DocumentBuilder()
    .setTitle('Booking Platform ')
    .setDescription('The Booking Platform Endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();