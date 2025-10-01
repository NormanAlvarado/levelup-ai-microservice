import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { WorkoutPlan } from '../shared/types/workout.interface';
import { DietPlan } from '../shared/types/diet.interface';
import { Recommendation } from '../shared/types/user.interface';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('supabase.url');
    const supabaseKey = this.configService.get<string>('supabase.serviceKey');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration is missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async saveWorkoutPlan(workoutPlan: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    try {
      const { data, error } = await this.supabase
        .from('workout_plans')
        .insert([
          {
            user_id: workoutPlan.userId,
            name: workoutPlan.name,
            description: workoutPlan.description,
            difficulty: workoutPlan.difficulty,
            goal: workoutPlan.goal,
            days_per_week: workoutPlan.daysPerWeek,
            estimated_duration: workoutPlan.estimatedDuration,
            exercises: workoutPlan.exercises,
          },
        ])
        .select()
        .single();

      if (error) {
        this.logger.error('Error saving workout plan:', error);
        throw new Error(`Failed to save workout plan: ${error.message}`);
      }

      return this.mapWorkoutPlanFromDB(data);
    } catch (error) {
      this.logger.error('Error in saveWorkoutPlan:', error);
      throw error;
    }
  }

  async saveDietPlan(dietPlan: Partial<DietPlan>): Promise<DietPlan> {
    try {
      const { data, error } = await this.supabase
        .from('diet_plans')
        .insert([
          {
            user_id: dietPlan.userId,
            name: dietPlan.name,
            description: dietPlan.description,
            goal: dietPlan.goal,
            total_calories: dietPlan.totalCalories,
            target_macros: dietPlan.targetMacros,
            meals: dietPlan.meals,
            restrictions: dietPlan.restrictions,
          },
        ])
        .select()
        .single();

      if (error) {
        this.logger.error('Error saving diet plan:', error);
        throw new Error(`Failed to save diet plan: ${error.message}`);
      }

      return this.mapDietPlanFromDB(data);
    } catch (error) {
      this.logger.error('Error in saveDietPlan:', error);
      throw error;
    }
  }

  async saveRecommendations(recommendations: Partial<Recommendation>[]): Promise<Recommendation[]> {
    try {
      const dbRecommendations = recommendations.map((rec) => ({
        user_id: rec.userId,
        type: rec.type,
        title: rec.title,
        description: rec.description,
        priority: rec.priority,
        category: rec.category,
        actionable: rec.actionable,
        metadata: rec.metadata,
      }));

      const { data, error } = await this.supabase
        .from('recommendations')
        .insert(dbRecommendations)
        .select();

      if (error) {
        this.logger.error('Error saving recommendations:', error);
        throw new Error(`Failed to save recommendations: ${error.message}`);
      }

      return data.map((rec) => this.mapRecommendationFromDB(rec));
    } catch (error) {
      this.logger.error('Error in saveRecommendations:', error);
      throw error;
    }
  }

  async getUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        this.logger.error('Error fetching user profile:', error);
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      return data;
    } catch (error) {
      this.logger.error('Error in getUserProfile:', error);
      throw error;
    }
  }

  async getWorkoutPlan(planId: string): Promise<WorkoutPlan | null> {
    try {
      const { data, error } = await this.supabase
        .from('workout_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        this.logger.error('Error fetching workout plan:', error);
        throw new Error(`Failed to fetch workout plan: ${error.message}`);
      }

      return this.mapWorkoutPlanFromDB(data);
    } catch (error) {
      this.logger.error('Error in getWorkoutPlan:', error);
      throw error;
    }
  }

  async getDietPlan(planId: string): Promise<DietPlan | null> {
    try {
      const { data, error } = await this.supabase
        .from('diet_plans')
        .select('*')
        .eq('id', planId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null;
        this.logger.error('Error fetching diet plan:', error);
        throw new Error(`Failed to fetch diet plan: ${error.message}`);
      }

      return this.mapDietPlanFromDB(data);
    } catch (error) {
      this.logger.error('Error in getDietPlan:', error);
      throw error;
    }
  }

  private mapWorkoutPlanFromDB(data: any): WorkoutPlan {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      difficulty: data.difficulty,
      goal: data.goal,
      daysPerWeek: data.days_per_week,
      estimatedDuration: data.estimated_duration,
      exercises: data.exercises,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapDietPlanFromDB(data: any): DietPlan {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      description: data.description,
      goal: data.goal,
      totalCalories: data.total_calories,
      targetMacros: data.target_macros,
      meals: data.meals,
      restrictions: data.restrictions,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

  private mapRecommendationFromDB(data: any): Recommendation {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      title: data.title,
      description: data.description,
      priority: data.priority,
      category: data.category,
      actionable: data.actionable,
      metadata: data.metadata,
      createdAt: data.created_at,
    };
  }
}