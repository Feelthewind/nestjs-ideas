import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  ping() {
    return { ping: 'pong' };
  }

  @Get('err')
  err() {
    throw new HttpException(
      {
        statusCode: HttpStatus.FORBIDDEN,
        error: 'Forbidden',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
