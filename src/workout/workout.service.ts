import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiProvider } from '../external-apis/openai.provider';
import { GeminiProvider } from '../external-apis/gemini.provider';
import { SupabaseService } from '../supabase/supabase.service';
import { GenerateWorkoutDto } from '../shared/dto/generate-workout.dto';
import { WorkoutPlan } from '../shared/types/workout.interface';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '../shared/utils/api-response';

@Injectable()
export class WorkoutService {
  private readonly logger = new Logger(WorkoutService.name);

  constructor(
    private configService: ConfigService,
    private openAiProvider: OpenAiProvider,
    private geminiProvider: GeminiProvider,
    private supabaseService: SupabaseService,
  ) {}

  async generateWorkout(dto: GenerateWorkoutDto): Promise<ApiResponse<WorkoutPlan>> {
    try {
      this.logger.log(`Generating workout for user: ${dto.userId}`);

      // Get AI provider from config
      const provider = this.configService.get<string>('ai.defaultProvider') || 'openai';
      
      // Generate workout plan using selected AI provider
      let aiResponse;
      if (provider === 'gemini') {
        aiResponse = await this.geminiProvider.generateWorkoutPlan(dto);
      } else {
        aiResponse = await this.openAiProvider.generateWorkoutPlan(dto);
      }

      // Create workout plan object
      const workoutPlan: Partial<WorkoutPlan> = {
        userId: dto.userId,
        name: aiResponse.name,
        description: aiResponse.description,
        difficulty: dto.difficulty,
        goal: dto.goal,
        daysPerWeek: dto.daysPerWeek,
        estimatedDuration: dto.duration,
        exercises: aiResponse.exercises,
      };

      // Save to Supabase
      const savedWorkout = await this.supabaseService.saveWorkoutPlan(workoutPlan);

      this.logger.log(`Workout generated successfully for user: ${dto.userId}, ID: ${savedWorkout.id}`);

      return createSuccessResponse(savedWorkout, 'Workout plan generated successfully');
    } catch (error) {
      this.logger.error('Error generating workout:', error);
      return createErrorResponse(
        error.message,
        'Failed to generate workout plan'
      );
    }
  }

  async getWorkout(planId: string): Promise<ApiResponse<WorkoutPlan>> {
    try {
      const workoutPlan = await this.supabaseService.getWorkoutPlan(planId);
      
      if (!workoutPlan) {
        return createErrorResponse('Workout plan not found', 'The requested workout plan does not exist');
      }

      return createSuccessResponse(workoutPlan);
    } catch (error) {
      this.logger.error('Error fetching workout:', error);
      return createErrorResponse(
        error.message,
        'Failed to fetch workout plan'
      );
    }
  }

  async regenerateWorkout(planId: string, modifications: Partial<GenerateWorkoutDto>): Promise<ApiResponse<WorkoutPlan>> {
    try {
      // Get existing workout plan
      const existingPlan = await this.supabaseService.getWorkoutPlan(planId);
      if (!existingPlan) {
        return createErrorResponse('Workout plan not found', 'Cannot regenerate non-existent plan');
      }

      // Merge existing data with modifications
      const updatedDto: GenerateWorkoutDto = {
        userId: existingPlan.userId,
        goal: modifications.goal || existingPlan.goal,
        difficulty: modifications.difficulty || existingPlan.difficulty,
        daysPerWeek: modifications.daysPerWeek || existingPlan.daysPerWeek,
        duration: modifications.duration || existingPlan.estimatedDuration,
        equipment: modifications.equipment,
        targetMuscles: modifications.targetMuscles,
        preferences: modifications.preferences,
      };

      // Generate new workout
      return await this.generateWorkout(updatedDto);
    } catch (error) {
      this.logger.error('Error regenerating workout:', error);
      return createErrorResponse(
        error.message,
        'Failed to regenerate workout plan'
      );
    }
  }
}