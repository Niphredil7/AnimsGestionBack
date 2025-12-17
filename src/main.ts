import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UseGuards, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from './utils/http.exception.filter';
import { AuthGuard } from './auth/guard/access-token.guard';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors(
    //   {
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   credentials: true,
// }
)
  
  app.useGlobalGuards(
    app.get(AuthGuard)
  )

app.useGlobalPipes(
   new ValidationPipe({
  //     disableErrorMessages: true,
      whitelist: true,
      transform:true,
      // transformOptions: { enableImplicitConversion: true },
  }),
  );
app.useGlobalFilters(new HttpExceptionFilter())


;
await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
