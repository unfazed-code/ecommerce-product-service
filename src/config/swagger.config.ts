import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Ecommerce Product Microservice')
  .setDescription('Ecommerce Product Microservice')
  .setVersion('1.0')
  .addTag('ecommerce-product-microservice')
  .build();
