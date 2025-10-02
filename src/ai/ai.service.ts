import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkoutService } from '../workout/workout.service';
import { DietService } from '../diet/diet.service';
import { RecommendationService } from '../recommendation/recommendation.service';
import { SupabaseService } from '../supabase/supabase.service';
import { GenerateWorkoutDto } from '../shared/dto/generate-workout.dto';
import { GenerateDietDto } from '../shared/dto/generate-diet.dto';
import { RecommendationDto } from '../shared/dto/recommendation.dto';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '../shared/utils/api-response';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private configService: ConfigService,
    private workoutService: WorkoutService,
    private dietService: DietService,
    private recommendationService: RecommendationService,
    private supabaseService: SupabaseService,
  ) {}

  async getHealthStatus(): Promise<ApiResponse<any>> {
    try {
      const status = {
        service: 'LevelUp AI Microservice',
        version: '1.0.0',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        providers: {
          openai: !!this.configService.get<string>('openai.apiKey'),
          gemini: !!this.configService.get<string>('gemini.apiKey'),
          supabase: !!this.configService.get<string>('supabase.url'),
        },
        defaultProvider: this.configService.get<string>('ai.defaultProvider') || 'openai',
        endpoints: {
          workout: '/api/ai/workout',
          diet: '/api/ai/diet',
          recommendation: '/api/ai/recommendation',
        },
      };

      return createSuccessResponse(status);
    } catch (error) {
      this.logger.error('Error getting health status:', error);
      return createErrorResponse('Health check failed');
    }
  }

  async generateCompleteProfile(userId: string, workoutDto: GenerateWorkoutDto, dietDto: GenerateDietDto): Promise<ApiResponse<any>> {
    try {
      this.logger.log(`Generating complete profile for user: ${userId}`);

      // Validate that both DTOs are for the same user
      if (workoutDto.userId !== userId || dietDto.userId !== userId) {
        return createErrorResponse('User ID mismatch in request data');
      }

      // Generate workout and diet plans concurrently
      const [workoutResponse, dietResponse] = await Promise.all([
        this.workoutService.generateWorkout(workoutDto),
        this.dietService.generateDiet(dietDto),
      ]);

      // Check if both generations were successful
      if (!workoutResponse.success || !dietResponse.success) {
        return createErrorResponse('Failed to generate complete profile', 
          `Workout: ${workoutResponse.success ? 'OK' : workoutResponse.error}, Diet: ${dietResponse.success ? 'OK' : dietResponse.error}`
        );
      }

      // Generate initial recommendations based on new plans
      const recommendationDto: RecommendationDto = {
        userId,
        progressData: {
          completedWorkouts: 0,
          adherenceRate: 100, // Starting with 100%
        },
        context: 'Initial recommendations for new user with fresh workout and diet plans',
      };

      const recommendationsResponse = await this.recommendationService.generateRecommendations(recommendationDto);

      const completeProfile = {
        userId,
        workoutPlan: workoutResponse.data,
        dietPlan: dietResponse.data,
        recommendations: recommendationsResponse.success ? recommendationsResponse.data : [],
        createdAt: new Date().toISOString(),
        status: 'complete',
      };

      this.logger.log(`Complete profile generated successfully for user: ${userId}`);

      return createSuccessResponse(completeProfile, 'Complete fitness profile generated successfully');
    } catch (error) {
      this.logger.error('Error generating complete profile:', error);
      return createErrorResponse(
        error.message,
        'Failed to generate complete profile'
      );
    }
  }

  async updateUserProgress(userId: string, progressData: any): Promise<ApiResponse<any>> {
    try {
      this.logger.log(`Updating progress for user: ${userId}`);

      // Get current plans for the user
      const userProfile = await this.supabaseService.getUserProfile(userId);
      
      // Generate updated recommendations based on progress
      const recommendationDto: RecommendationDto = {
        userId,
        progressData,
        context: 'Progress update - analyze performance and suggest improvements',
      };

      const recommendationsResponse = await this.recommendationService.generateRecommendations(recommendationDto);

      const progressUpdate = {
        userId,
        progressData,
        recommendations: recommendationsResponse.success ? recommendationsResponse.data : [],
        updatedAt: new Date().toISOString(),
        insights: await this.generateProgressInsights(progressData),
      };

      return createSuccessResponse(progressUpdate, 'Progress updated and analyzed successfully');
    } catch (error) {
      this.logger.error('Error updating user progress:', error);
      return createErrorResponse(
        error.message,
        'Failed to update progress'
      );
    }
  }

  async getAiProviderStats(): Promise<ApiResponse<any>> {
    try {
      const stats = {
        availableProviders: ['openai', 'gemini'],
        currentProvider: this.configService.get<string>('ai.defaultProvider') || 'openai',
        providerHealth: {
          openai: this.configService.get<string>('openai.apiKey') ? 'configured' : 'missing_key',
          gemini: this.configService.get<string>('gemini.apiKey') ? 'configured' : 'missing_key',
        },
        capabilities: {
          workoutGeneration: true,
          dietPlanning: true,
          recommendations: true,
          progressAnalysis: true,
        },
        models: {
          openai: 'gpt-4-turbo-preview',
          gemini: 'gemini-2.5-flash',
        },
      };

      return createSuccessResponse(stats);
    } catch (error) {
      this.logger.error('Error getting AI provider stats:', error);
      return createErrorResponse('Failed to get provider statistics');
    }
  }

  private async generateProgressInsights(progressData: any): Promise<any> {
    const insights = {
      workoutConsistency: this.calculateConsistency(progressData.completedWorkouts),
      adherenceScore: progressData.adherenceRate,
      progressTrend: this.calculateProgressTrend(progressData),
      recommendations: this.getProgressRecommendations(progressData),
      nextMilestone: this.suggestNextMilestone(progressData),
    };

    return insights;
  }

  private calculateConsistency(completedWorkouts: number): string {
    if (completedWorkouts >= 20) return 'excellent';
    if (completedWorkouts >= 10) return 'good';
    if (completedWorkouts >= 5) return 'fair';
    return 'needs_improvement';
  }

  private calculateProgressTrend(progressData: any): string {
    const factors: string[] = [];
    
    if (progressData.weightProgress && Math.abs(progressData.weightProgress) > 1) {
      factors.push('weight_changing');
    }
    if (progressData.strengthProgress && Object.keys(progressData.strengthProgress).length > 0) {
      factors.push('strength_improving');
    }
    if (progressData.adherenceRate > 80) {
      factors.push('high_adherence');
    }

    if (factors.length >= 3) return 'excellent_progress';
    if (factors.length >= 2) return 'good_progress';
    if (factors.length >= 1) return 'moderate_progress';
    return 'slow_progress';
  }

  private getProgressRecommendations(progressData: any): string[] {
    const recommendations: string[] = [];

    if (progressData.adherenceRate < 70) {
      recommendations.push('Focus on building consistent habits');
    }
    if (progressData.completedWorkouts < 5) {
      recommendations.push('Aim to complete more workouts this week');
    }
    if (progressData.strengthProgress && Object.keys(progressData.strengthProgress).length === 0) {
      recommendations.push('Track your lifting progress to see improvements');
    }

    return recommendations;
  }

  private suggestNextMilestone(progressData: any): string {
    const workouts = progressData.completedWorkouts;
    
    if (workouts < 10) return 'Complete your first 10 workouts';
    if (workouts < 25) return 'Reach 25 total workouts';
    if (workouts < 50) return 'Achieve 50 workout milestone';
    return 'Maintain consistency for 100+ workouts';
  }
}