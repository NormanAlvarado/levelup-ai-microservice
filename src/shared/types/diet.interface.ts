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

export interface DietPlan {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  goal: DietGoal;
  totalCalories: number;
  targetMacros: MacroNutrients;
  meals: Meal[];
  restrictions: DietaryRestriction[];
  createdAt?: Date;
  updatedAt?: Date;
}

export enum DietGoal {
  LOSE_WEIGHT = 'lose_weight',
  GAIN_WEIGHT = 'gain_weight',
  MAINTAIN_WEIGHT = 'maintain_weight',
  BUILD_MUSCLE = 'build_muscle',
  IMPROVE_HEALTH = 'improve_health',
}

export enum DietaryRestriction {
  VEGETARIAN = 'vegetarian',
  VEGAN = 'vegan',
  NO_DAIRY = 'no_dairy',
  NO_GLUTEN = 'no_gluten',
  NO_NUTS = 'no_nuts',
  KETO = 'keto',
  PALEO = 'paleo',
  MEDITERRANEAN = 'mediterranean',
  LOW_CARB = 'low_carb',
  LOW_FAT = 'low_fat',
}