import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly appService: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
