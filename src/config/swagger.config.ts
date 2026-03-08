import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ecommerce API')
  .setDescription('Ecommerce API')
  .setVersion('1.0')
  .addTag('ecommerce')
  .build();
