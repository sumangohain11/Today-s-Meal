export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack',
  Tiffin = 'Tiffin'
}

export enum Cuisine {
  NorthIndian = 'North Indian',
  SouthIndian = 'South Indian',
  Maharashtrian = 'Maharashtrian',
  Bengali = 'Bengali',
  Gujarati = 'Gujarati',
  Punjabi = 'Punjabi',
  Assamese = 'Assamese',
  IndoChinese = 'Indo-Chinese'
}

export enum SpiceLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Recipe {
  id?: string;
  name: string;
  description: string;
  cookingTime: string; // e.g., "20 mins"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number; // kcal
  ingredients: string[];
  steps: string[];
  isVeg: boolean;
  cuisine: string;
  imageKeyword?: string; // Used to fetch a relevant placeholder
}

export interface WeeklyPlanDay {
  day: string;
  planetaryNote: string; // Astrology/Science note
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}

export interface SearchFilters {
  isVeg: boolean;
  ingredients: string;
  timeLimit: string; // '10', '20', '30+'
  spiceLevel: SpiceLevel;
  cuisine: string;
  mealType: string;
}
