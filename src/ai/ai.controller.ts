import { Controller, Get, Post, Body, Param, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiParam } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { GenerateWorkoutDto } from '../shared/dto/generate-workout.dto';
import { GenerateDietDto } from '../shared/dto/generate-diet.dto';
import { ApiResponse } from '../shared/utils/api-response';

@ApiTags('AI Main Service')
@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check for AI microservice',
    description: 'Returns the health status and configuration of the AI microservice',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Health status retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          service: 'LevelUp AI Microservice',
          version: '1.0.0',
          status: 'healthy',
          timestamp: '2025-01-01T10:00:00.000Z',
          providers: {
            openai: true,
            gemini: true,
            supabase: true
          },
          defaultProvider: 'openai',
          endpoints: {
            workout: '/api/ai/workout',
            diet: '/api/ai/diet',
            recommendation: '/api/ai/recommendation'
          }
        }
      }
    }
  })
  async getHealth(): Promise<ApiResponse<any>> {
    return await this.aiService.getHealthStatus();
  }

  @Post('complete-profile/:userId')
  @ApiOperation({
    summary: 'Generate complete fitness profile',
    description: 'Creates both workout and diet plans for a user along with initial recommendations',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Complete profile generated successfully',
    schema: {
      example: {
        success: true,
        data: {
          userId: 'uuid-123',
          workoutPlan: {
            id: 'workout-uuid',
            name: 'Muscle Growth Plan',
            exercises: []
          },
          dietPlan: {
            id: 'diet-uuid',
            name: 'Weight Loss Nutrition Plan',
            meals: []
          },
          recommendations: [
            {
              title: 'Welcome to Your Fitness Journey',
              description: 'Start with consistency and focus on proper form',
              type: 'motivational'
            }
          ],
          createdAt: '2025-01-01T10:00:00.000Z',
          status: 'complete'
        },
        message: 'Complete fitness profile generated successfully'
      }
    }
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async generateCompleteProfile(
    @Param('userId') userId: string,
    @Body(ValidationPipe) profileData: {
      workout: GenerateWorkoutDto;
      diet: GenerateDietDto;
    },
  ): Promise<ApiResponse<any>> {
    return await this.aiService.generateCompleteProfile(
      userId,
      profileData.workout,
      profileData.diet
    );
  }

  @Post('progress/:userId')
  @ApiOperation({
    summary: 'Update user progress and get analysis',
    description: 'Updates user progress data and generates insights and recommendations',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Progress updated and analyzed successfully',
    schema: {
      example: {
        success: true,
        data: {
          userId: 'uuid-123',
          progressData: {
            completedWorkouts: 15,
            adherenceRate: 85,
            weightProgress: -2.5
          },
          recommendations: [],
          updatedAt: '2025-01-01T10:00:00.000Z',
          insights: {
            workoutConsistency: 'good',
            adherenceScore: 85,
            progressTrend: 'good_progress',
            recommendations: [],
            nextMilestone: 'Reach 25 total workouts'
          }
        },
        message: 'Progress updated and analyzed successfully'
      }
    }
  })
  async updateProgress(
    @Param('userId') userId: string,
    @Body() progressData: any,
  ): Promise<ApiResponse<any>> {
    return await this.aiService.updateUserProgress(userId, progressData);
  }

  @Get('providers')
  @ApiOperation({
    summary: 'Get AI provider statistics',
    description: 'Returns information about available AI providers and their status',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Provider statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          availableProviders: ['openai', 'gemini'],
          currentProvider: 'openai',
          providerHealth: {
            openai: 'configured',
            gemini: 'configured'
          },
          capabilities: {
            workoutGeneration: true,
            dietPlanning: true,
            recommendations: true,
            progressAnalysis: true
          },
          models: {
            openai: 'gpt-4-turbo-preview',
            gemini: 'gemini-2.5-flash'
          }
        }
      }
    }
  })
  async getProviderStats(): Promise<ApiResponse<any>> {
    return await this.aiService.getAiProviderStats();
  }
}