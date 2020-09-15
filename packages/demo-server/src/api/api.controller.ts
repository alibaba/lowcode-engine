import { Controller, Res, Get, Post, Body, Header } from '@nestjs/common';
import { Response } from 'express';
import { ApiService } from './api.service';
import { GenerateProjectDto } from '../dto/generate-project.dto';

@Controller('api')
export class ApiController {
  private readonly apiService: ApiService;

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  @Get('generate/test')
  generateTest() {
    return 'generate test';
  }

  @Post('generate/project')
  @Header('Content-Type', 'application/zip')
  async generateProject(@Res() res: Response, @Body() dto: GenerateProjectDto) {
    const file = await this.apiService.generateProject(dto.schema);
    file.pipe(res);
  }
}
