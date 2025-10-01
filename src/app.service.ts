import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return {
      service: 'LevelUp AI Microservice',
      version: '1.0.0',
      description: 'AI-powered fitness and nutrition microservice for LevelUp Gym App',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        health: '/api/ai/health',
        docs: '/api/ai/docs',
        workout: '/api/ai/workout',
        diet: '/api/ai/diet',
        recommendation: '/api/ai/recommendation',
      },
      features: [
        'AI-powered workout generation',
        'Personalized nutrition planning',
        'Adaptive recommendations',
        'Progress tracking and analysis',
        'Multi-provider AI support (OpenAI, Gemini)',
      ],
    };
  }
}
