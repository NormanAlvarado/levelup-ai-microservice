export interface UserProfile {
  id: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  fitnessGoals: string[];
  medicalConditions?: string[];
  preferences?: UserPreferences;
}

export interface UserPreferences {
  workoutTypes?: string[];
  dietaryRestrictions?: string[];
  availableEquipment?: string[];
  workoutDuration?: number;
  workoutFrequency?: number;
}

export enum ActivityLevel {
  SEDENTARY = 'sedentary',
  LIGHTLY_ACTIVE = 'lightly_active',
  MODERATELY_ACTIVE = 'moderately_active',
  VERY_ACTIVE = 'very_active',
  EXTREMELY_ACTIVE = 'extremely_active',
}

export interface ProgressData {
  userId: string;
  workoutId?: string;
  dietId?: string;
  completedWorkouts: number;
  weightProgress?: number;
  strengthProgress?: Record<string, number>;
  enduranceProgress?: number;
  adherenceRate: number;
  feedback?: string;
  timestamp: Date;
}

export interface Recommendation {
  id?: string;
  userId: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  category: RecommendationCategory;
  actionable: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
}

export enum RecommendationType {
  WORKOUT_ADJUSTMENT = 'workout_adjustment',
  DIET_MODIFICATION = 'diet_modification',
  REST_RECOMMENDATION = 'rest_recommendation',
  GOAL_SUGGESTION = 'goal_suggestion',
  MOTIVATIONAL = 'motivational',
}

export enum RecommendationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum RecommendationCategory {
  FITNESS = 'fitness',
  NUTRITION = 'nutrition',
  RECOVERY = 'recovery',
  MOTIVATION = 'motivation',
  HEALTH = 'health',
}