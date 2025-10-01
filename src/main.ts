import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Global prefix for all routes
  app.setGlobalPrefix('api/ai');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('LevelUp AI Microservice')
    .setDescription('AI-powered fitness and nutrition microservice for LevelUp Gym App')
    .setVersion('1.0.0')
    .addTag('AI Main Service', 'Core AI orchestration endpoints')
    .addTag('Workout', 'Workout plan generation and management')
    .addTag('Diet', 'Diet plan generation and management')
    .addTag('Recommendations', 'Personalized recommendations and insights')
    .addServer('/api/ai', 'API Base URL')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/ai/docs', app, document, {
    customSiteTitle: 'LevelUp AI API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 LevelUp AI Microservice is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/ai/docs`);
  console.log(`🏥 Health Check: http://localhost:${port}/api/ai/health`);
}

bootstrap();
