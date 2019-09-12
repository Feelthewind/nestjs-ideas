import { Body, Controller, Logger, Post, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '../shared/validation.pipe';
import { UserDTO } from './user.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  logger = new Logger('UserController');

  constructor(private userService: UserService) {}

  @Post('auth/register')
  @UsePipes(new ValidationPipe())
  register(@Body() data: UserDTO) {
    this.logger.log(JSON.stringify(data));
    return this.userService.register(data);
  }

  @Post('auth/login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: UserDTO) {
    this.logger.log(JSON.stringify(data));
    return this.userService.login(data);
  }
}
