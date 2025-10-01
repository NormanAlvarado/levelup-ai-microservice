import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Welcome message',
    description: 'Returns welcome information for the LevelUp AI Microservice',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message retrieved successfully',
    schema: {
      example: {
        service: 'LevelUp AI Microservice',
        version: '1.0.0',
        description: 'AI-powered fitness and nutrition microservice',
        endpoints: {
          health: '/api/ai/health',
          docs: '/api/ai/docs',
          workout: '/api/ai/workout',
          diet: '/api/ai/diet',
          recommendation: '/api/ai/recommendation',
        },
      },
    },
  })
  getWelcome() {
    return this.appService.getWelcome();
  }
}
