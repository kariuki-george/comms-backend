import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { initAdapters } from '@ws/adapter.init';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get<ConfigService>(ConfigService);
  initAdapters(app);
  app.enableCors({
    origin:
      configService.get<string>('NODE_ENV') &&
      configService.get<string>('NODE_ENV') === 'production'
        ? [
            'https://comms.p.kariukigeorge.me',
            'https://comms-test.p.kariukigeorge.me',
          ]
        : '*',
  });

  // Open api
  const config = new DocumentBuilder()
    .setTitle('Comms Api')
    .setDescription('Contains Comms api and route documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT'), () => {
    console.log(
      'Comms server started successfully on port ',
      configService.get('PORT'),
    );
  });
}
bootstrap();
