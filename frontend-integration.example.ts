// =============================================================================
// LevelUp AI Microservice Integration
// =============================================================================
// Este archivo debe ir en tu proyecto principal de React
// Ubicación sugerida: src/services/aiMicroservice.ts

import axios, { AxiosInstance, AxiosError } from 'axios';

// Configuración del cliente HTTP para el microservicio de IA
class AIMicroservice {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Usar la variable de entorno del proyecto principal
    this.baseURL = process.env.VITE_AI_SERVICE_URL || 'http://localhost:3001/api';
    
    this.client = axios.create({
      baseURL: `${this.baseURL}/ai`,
      timeout: 30000, // 30 segundos timeout para operaciones de IA
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('AI Microservice Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // =============================================================================
  // MÉTODOS DE WORKOUT (RUTINAS)
  // =============================================================================
  
  async generateWorkout(workoutData: {
    userId: string;
    goal: 'gain_muscle' | 'lose_weight' | 'improve_endurance' | 'maintain_fitness' | 'strength_training' | 'flexibility';
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    daysPerWeek: number;
    duration: number;
    equipment?: string[];
    targetMuscles?: string[];
    preferences?: string;
  }) {
    try {
      const response = await this.client.post('/workout', workoutData);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to generate workout');
    }
  }

  async getWorkout(workoutId: string) {
    try {
      const response = await this.client.get(`/workout/${workoutId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to get workout');
    }
  }

  async regenerateWorkout(workoutId: string, modifications: any) {
    try {
      const response = await this.client.post(`/workout/${workoutId}/regenerate`, modifications);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to regenerate workout');
    }
  }

  // =============================================================================
  // MÉTODOS DE DIET (NUTRICIÓN)
  // =============================================================================
  
  async generateDiet(dietData: {
    userId: string;
    calories: number;
    goal: 'lose_weight' | 'gain_weight' | 'maintain_weight' | 'build_muscle' | 'improve_health';
    restrictions?: string[];
    mealsPerDay?: number;
    targetProtein?: number;
    preferredFoods?: string[];
    avoidFoods?: string[];
    preferences?: string;
  }) {
    try {
      const response = await this.client.post('/diet', dietData);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to generate diet');
    }
  }

  async getDiet(dietId: string) {
    try {
      const response = await this.client.get(`/diet/${dietId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to get diet');
    }
  }

  async adjustCalories(dietId: string, newCalories: number) {
    try {
      const response = await this.client.post(`/diet/${dietId}/adjust-calories/${newCalories}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to adjust calories');
    }
  }

  // =============================================================================
  // MÉTODOS DE RECOMMENDATIONS (RECOMENDACIONES)
  // =============================================================================
  
  async generateRecommendations(recommendationData: {
    userId: string;
    progressData: {
      completedWorkouts: number;
      adherenceRate: number;
      weightProgress?: number;
      strengthProgress?: Record<string, number>;
      enduranceProgress?: number;
      feedback?: string;
    };
    currentWorkoutId?: string;
    currentDietId?: string;
    context?: string;
  }) {
    try {
      const response = await this.client.post('/recommendation', recommendationData);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to generate recommendations');
    }
  }

  async getPersonalizedInsights(userId: string, workoutId?: string, dietId?: string) {
    try {
      const params = new URLSearchParams();
      if (workoutId) params.append('workoutId', workoutId);
      if (dietId) params.append('dietId', dietId);
      
      const response = await this.client.get(
        `/recommendation/${userId}/insights?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to get insights');
    }
  }

  async getMotivationalContent(userId: string, context?: string) {
    try {
      const params = context ? `?context=${encodeURIComponent(context)}` : '';
      const response = await this.client.get(`/recommendation/${userId}/motivation${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to get motivational content');
    }
  }

  // =============================================================================
  // MÉTODOS PRINCIPALES
  // =============================================================================
  
  async generateCompleteProfile(userId: string, profileData: {
    workout: Parameters<typeof this.generateWorkout>[0];
    diet: Parameters<typeof this.generateDiet>[0];
  }) {
    try {
      const response = await this.client.post(`/complete-profile/${userId}`, profileData);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to generate complete profile');
    }
  }

  async updateProgress(userId: string, progressData: any) {
    try {
      const response = await this.client.post(`/progress/${userId}`, progressData);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to update progress');
    }
  }

  async getHealthStatus() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to get health status');
    }
  }

  async getProviderStats() {
    try {
      const response = await this.client.get('/providers');
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError, 'Failed to get provider stats');
    }
  }

  // =============================================================================
  // MÉTODOS AUXILIARES
  // =============================================================================
  
  private handleError(error: AxiosError, defaultMessage: string): Error {
    if (error.response?.data) {
      const errorData = error.response.data as any;
      return new Error(errorData.error || errorData.message || defaultMessage);
    }
    return new Error(error.message || defaultMessage);
  }
}

// Exportar instancia singleton
export const aiMicroservice = new AIMicroservice();

// Exportar tipos para TypeScript
export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  difficulty: string;
  goal: string;
  daysPerWeek: number;
  estimatedDuration: number;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  duration?: string;
  restTime?: string;
  instructions?: string;
  targetMuscles?: string[];
  equipment?: string;
}

export interface DietPlan {
  id: string;
  userId: string;
  name: string;
  description?: string;
  goal: string;
  totalCalories: number;
  targetMacros: MacroNutrients;
  meals: Meal[];
  restrictions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id?: string;
  name: string;
  items: FoodItem[];
  totalCalories: number;
  macros: MacroNutrients;
  instructions?: string;
  prepTime?: number;
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Recommendation {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  actionable: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}
