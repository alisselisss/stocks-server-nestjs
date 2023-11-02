import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/socket.io', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  const server = app.listen(3000);

  const io = require('socket.io')(server, {
    cors: {
      origin: ['http://192.168.56.1:3000', 'http://localhost:8080'],
      credentials: true,
    },
  });

  app.useWebSocketAdapter(new IoAdapter(io));

  app.use(cors({
    origin: ['http://192.168.56.1:3000', 'http://localhost:8080'],
    credentials: true,
  }));

}
bootstrap();
