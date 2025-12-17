import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    //const status = exception.getStatus();

    let status: HttpStatus = 500;
    let body:any = {
        timestamp: new Date().toISOString(),
        path: request.url,
        message:exception.message,
    }
  switch (exception.code) {
    case "P2002":
    status = HttpStatus.PRECONDITION_FAILED,
    body= { ...body, body: request.body, message:'Unique constriant failed'}
    break;
    case "P2025":
        status= HttpStatus.NOT_FOUND;
        body = { ...body, message: "Not Found"};
        break;

}   
    response.status(status).json(body)
};
}

