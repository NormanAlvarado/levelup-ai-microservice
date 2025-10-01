import { Controller, Post, Get, Body, Param, Query, ValidationPipe, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse as SwaggerApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';
import { RecommendationDto } from '../shared/dto/recommendation.dto';
import { Recommendation } from '../shared/types/user.interface';
import { ApiResponse } from '../shared/utils/api-response';

@ApiTags('Recommendations')
@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Post()
  @ApiOperation({
    summary: 'Generate personalized recommendations',
    description: 'Creates personalized recommendations based on user progress and current plans',
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Recommendations generated successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'uuid-rec-1',
            type: 'workout_adjustment',
            title: 'Increase Training Intensity',
            description: 'Based on your progress, consider adding 5-10% more weight to your compound exercises.',
            priority: 'medium',
            category: 'fitness',
            actionable: true,
            metadata: {
              suggestedIncrease: '5-10%',
              exercises: ['bench_press', 'squat', 'deadlift']
            }
          }
        ],
        message: 'Recommendations generated successfully'
      }
    }
  })
  @SwaggerApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @SwaggerApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to generate recommendations',
  })
  async generateRecommendations(
    @Body(ValidationPipe) recommendationDto: RecommendationDto,
  ): Promise<ApiResponse<Recommendation[]>> {
    return await this.recommendationService.generateRecommendations(recommendationDto);
  }

  @Get(':userId/insights')
  @ApiOperation({
    summary: 'Get personalized insights for user',
    description: 'Retrieves comprehensive insights about user\'s fitness journey and plans',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
  })
  @ApiQuery({
    name: 'workoutId',
    description: 'Current workout plan ID',
    type: 'string',
    required: false,
  })
  @ApiQuery({
    name: 'dietId',
    description: 'Current diet plan ID',
    type: 'string',
    required: false,
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Personalized insights retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          userId: 'uuid-123',
          profileComplete: true,
          hasWorkoutPlan: true,
          hasDietPlan: true,
          workoutInsights: {
            totalExercises: 8,
            difficulty: 'intermediate',
            estimatedBurn: 450,
            muscleGroups: ['chest', 'legs', 'back'],
            recommendation: 'Well-balanced workout plan. Stay consistent for best results'
          },
          dietInsights: {
            totalMeals: 4,
            dailyCalories: 2200,
            macroBalance: { protein: 150, carbs: 250, fat: 80 },
            mealVariety: 25,
            recommendation: 'Balanced calorie distribution. Focus on consistent meal timing'
          },
          generalTips: [
            'Stay hydrated by drinking at least 8 glasses of water daily',
            'Aim for 7-9 hours of quality sleep each night',
            'Include both cardio and strength training in your routine'
          ],
          nextSteps: [
            'Track your progress and update plans as needed',
            'Consider adding variety to prevent plateaus'
          ]
        },
        message: 'Personalized insights generated successfully'
      }
    }
  })
  async getPersonalizedInsights(
    @Param('userId') userId: string,
    @Query('workoutId') workoutId?: string,
    @Query('dietId') dietId?: string,
  ): Promise<ApiResponse<any>> {
    return await this.recommendationService.getPersonalizedInsights(userId, workoutId, dietId);
  }

  @Get(':userId/motivation')
  @ApiOperation({
    summary: 'Get motivational content for user',
    description: 'Generates motivational messages, tips, and quotes to keep user engaged',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: 'string',
  })
  @ApiQuery({
    name: 'context',
    description: 'Additional context for personalized motivation',
    type: 'string',
    required: false,
  })
  @SwaggerApiResponse({
    status: HttpStatus.OK,
    description: 'Motivational content generated successfully',
    schema: {
      example: {
        success: true,
        data: {
          userId: 'uuid-123',
          motivationalMessages: [
            {
              title: 'Keep Pushing Forward',
              description: 'You\'re making great progress! Every workout brings you closer to your goals.',
              type: 'motivational',
              priority: 'medium'
            }
          ],
          dailyTip: 'Start your day with a glass of water to kickstart your metabolism',
          quote: '"The only bad workout is the one that didn\'t happen." - Unknown'
        },
        message: 'Motivational content generated successfully'
      }
    }
  })
  async getMotivationalContent(
    @Param('userId') userId: string,
    @Query('context') context?: string,
  ): Promise<ApiResponse<any>> {
    return await this.recommendationService.generateMotivationalContent(userId, context);
  }
}