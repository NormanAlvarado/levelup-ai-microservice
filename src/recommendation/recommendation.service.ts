import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAiProvider } from '../external-apis/openai.provider';
import { GeminiProvider } from '../external-apis/gemini.provider';
import { SupabaseService } from '../supabase/supabase.service';
import { RecommendationDto } from '../shared/dto/recommendation.dto';
import { Recommendation } from '../shared/types/user.interface';
import { ApiResponse, createSuccessResponse, createErrorResponse } from '../shared/utils/api-response';

@Injectable()
export class RecommendationService {
  private readonly logger = new Logger(RecommendationService.name);

  constructor(
    private configService: ConfigService,
    private openAiProvider: OpenAiProvider,
    private geminiProvider: GeminiProvider,
    private supabaseService: SupabaseService,
  ) {}

  async generateRecommendations(dto: RecommendationDto): Promise<ApiResponse<Recommendation[]>> {
    try {
      this.logger.log(`Generating recommendations for user: ${dto.userId}`);

      // Get AI provider from config
      const provider = this.configService.get<string>('ai.defaultProvider') || 'openai';
      
      // Generate recommendations using selected AI provider
      let aiResponse;
      if (provider === 'gemini') {
        aiResponse = await this.geminiProvider.generateRecommendations(dto);
      } else {
        aiResponse = await this.openAiProvider.generateRecommendations(dto);
      }

      // Convert AI response to Recommendation objects
      const recommendations: Partial<Recommendation>[] = aiResponse.recommendations.map((rec: any) => ({
        userId: dto.userId,
        type: rec.type,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        category: rec.category,
        actionable: rec.actionable,
        metadata: rec.metadata || {},
      }));

      // Save to Supabase
      const savedRecommendations = await this.supabaseService.saveRecommendations(recommendations);

      this.logger.log(`Generated ${savedRecommendations.length} recommendations for user: ${dto.userId}`);

      return createSuccessResponse(savedRecommendations, 'Recommendations generated successfully');
    } catch (error) {
      this.logger.error('Error generating recommendations:', error);
      return createErrorResponse<Recommendation[]>(
        error.message,
        'Failed to generate recommendations'
      );
    }
  }

  async getPersonalizedInsights(
    userId: string,
    workoutId?: string,
    dietId?: string
  ): Promise<ApiResponse<any>> {
    try {
      this.logger.log(`Generating personalized insights for user: ${userId}`);

      // Get user profile and plans from Supabase
      const userProfile = await this.supabaseService.getUserProfile(userId);
      const workoutPlan = workoutId ? await this.supabaseService.getWorkoutPlan(workoutId) : null;
      const dietPlan = dietId ? await this.supabaseService.getDietPlan(dietId) : null;

      // Create insights based on available data
      const insights = {
        userId,
        profileComplete: !!userProfile,
        hasWorkoutPlan: !!workoutPlan,
        hasDietPlan: !!dietPlan,
        workoutInsights: workoutPlan ? this.analyzeWorkoutPlan(workoutPlan) : null,
        dietInsights: dietPlan ? this.analyzeDietPlan(dietPlan) : null,
        generalTips: this.getGeneralTips(userProfile),
        nextSteps: this.suggestNextSteps(userProfile, workoutPlan, dietPlan),
      };

      return createSuccessResponse(insights, 'Personalized insights generated successfully');
    } catch (error) {
      this.logger.error('Error generating insights:', error);
      return createErrorResponse(
        error.message,
        'Failed to generate personalized insights'
      );
    }
  }

  async generateMotivationalContent(
    userId: string,
    context?: string
  ): Promise<ApiResponse<any>> {
    try {
      this.logger.log(`Generating motivational content for user: ${userId}`);

      // Create a simple recommendation DTO for motivational content
      const motivationDto: RecommendationDto = {
        userId,
        progressData: {
          completedWorkouts: 0,
          adherenceRate: 75, // Default moderate adherence
        },
        context: `Generate motivational content. ${context || 'Focus on encouragement and positive reinforcement.'}`,
        requestedTypes: ['motivational' as any],
      };

      // Use the existing recommendation generation but filter for motivational only
      const response = await this.generateRecommendations(motivationDto);
      
      if (!response.success || !response.data) {
        return createErrorResponse('Failed to generate motivational content');
      }

      // Extract only motivational recommendations
      const motivationalContent = response.data.filter(rec => 
        rec.type === 'motivational' || rec.category === 'motivation'
      );

      return createSuccessResponse({
        userId,
        motivationalMessages: motivationalContent,
        dailyTip: this.getDailyTip(),
        quote: this.getInspirationalQuote(),
      }, 'Motivational content generated successfully');
    } catch (error) {
      this.logger.error('Error generating motivational content:', error);
      return createErrorResponse(
        error.message,
        'Failed to generate motivational content'
      );
    }
  }

  private analyzeWorkoutPlan(workoutPlan: any): any {
    return {
      totalExercises: workoutPlan.exercises?.length || 0,
      difficulty: workoutPlan.difficulty,
      estimatedBurn: this.estimateCalorieBurn(workoutPlan),
      muscleGroups: this.extractMuscleGroups(workoutPlan.exercises),
      recommendation: this.getWorkoutRecommendation(workoutPlan),
    };
  }

  private analyzeDietPlan(dietPlan: any): any {
    return {
      totalMeals: dietPlan.meals?.length || 0,
      dailyCalories: dietPlan.totalCalories,
      macroBalance: dietPlan.targetMacros,
      mealVariety: this.calculateMealVariety(dietPlan.meals),
      recommendation: this.getDietRecommendation(dietPlan),
    };
  }

  private getGeneralTips(userProfile: any): string[] {
    const tips = [
      'Stay hydrated by drinking at least 8 glasses of water daily',
      'Aim for 7-9 hours of quality sleep each night',
      'Include both cardio and strength training in your routine',
      'Listen to your body and allow for rest days',
      'Focus on whole, unprocessed foods for better nutrition',
    ];

    return tips.slice(0, 3); // Return 3 random tips
  }

  private suggestNextSteps(userProfile: any, workoutPlan: any, dietPlan: any): string[] {
    const steps: string[] = [];

    if (!workoutPlan) {
      steps.push('Create your first personalized workout plan');
    }
    if (!dietPlan) {
      steps.push('Generate a nutrition plan aligned with your goals');
    }
    if (workoutPlan && dietPlan) {
      steps.push('Track your progress and update plans as needed');
      steps.push('Consider adding variety to prevent plateaus');
    }

    return steps;
  }

  private estimateCalorieBurn(workoutPlan: any): number {
    // Simple estimation based on duration and exercise count
    const baseBurn = workoutPlan.estimatedDuration * 8; // 8 calories per minute base
    const intensity = workoutPlan.difficulty === 'advanced' ? 1.3 : 
                     workoutPlan.difficulty === 'intermediate' ? 1.1 : 1.0;
    return Math.round(baseBurn * intensity);
  }

  private extractMuscleGroups(exercises: any[]): string[] {
    if (!exercises) return [];
    
    const muscleGroups = new Set<string>();
    exercises.forEach(exercise => {
      if (exercise.targetMuscles) {
        exercise.targetMuscles.forEach((muscle: string) => muscleGroups.add(muscle));
      }
    });
    
    return Array.from(muscleGroups);
  }

  private getWorkoutRecommendation(workoutPlan: any): string {
    const exerciseCount = workoutPlan.exercises?.length || 0;
    if (exerciseCount < 5) {
      return 'Consider adding more exercises for a complete workout';
    } else if (exerciseCount > 12) {
      return 'Great comprehensive plan! Make sure to allow adequate rest between sets';
    }
    return 'Well-balanced workout plan. Stay consistent for best results';
  }

  private getDietRecommendation(dietPlan: any): string {
    const calories = dietPlan.totalCalories;
    if (calories < 1500) {
      return 'Consider increasing calories to ensure adequate nutrition';
    } else if (calories > 3000) {
      return 'High calorie plan - make sure it aligns with your activity level';
    }
    return 'Balanced calorie distribution. Focus on consistent meal timing';
  }

  private calculateMealVariety(meals: any[]): number {
    if (!meals) return 0;
    
    const uniqueIngredients = new Set<string>();
    meals.forEach(meal => {
      if (meal.items) {
        meal.items.forEach((item: any) => uniqueIngredients.add(item.name));
      }
    });
    
    return uniqueIngredients.size;
  }

  private getDailyTip(): string {
    const tips = [
      'Start your day with a glass of water to kickstart your metabolism',
      'Take the stairs instead of the elevator when possible',
      'Practice mindful eating by chewing slowly and savoring your food',
      'Do a 5-minute stretch routine before bed for better sleep',
      'Plan your meals in advance to avoid unhealthy food choices',
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  }

  private getInspirationalQuote(): string {
    const quotes = [
      '"The only bad workout is the one that didn\'t happen." - Unknown',
      '"Your body can do it. It\'s your mind you have to convince." - Unknown',
      '"Success isn\'t given. It\'s earned in the gym." - Unknown',
      '"The groundwork for all happiness is good health." - Leigh Hunt',
      '"Take care of your body. It\'s the only place you have to live." - Jim Rohn',
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}