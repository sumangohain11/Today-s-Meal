import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Recipe, WeeklyPlanDay, SearchFilters } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for a single recipe
const recipeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    cookingTime: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
    calories: { type: Type.NUMBER },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    steps: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING } 
    },
    isVeg: { type: Type.BOOLEAN },
    cuisine: { type: Type.STRING },
    imageKeyword: { type: Type.STRING, description: "A simple english keyword to search for an image of this dish, e.g. 'paneer butter masala'" }
  },
  required: ['name', 'description', 'cookingTime', 'difficulty', 'ingredients', 'steps', 'isVeg', 'cuisine']
};

export const suggestRecipes = async (filters: SearchFilters, isIHaveNothingMode: boolean = false): Promise<Recipe[]> => {
  const model = "gemini-2.5-flash";
  
  let prompt = "";
  
  if (isIHaveNothingMode) {
    prompt = `I have almost no ingredients. Suggest 5 ultra-simple Indian meals (like Maggi variations, Egg scramble, Aloo fry, Dal chawal, Quick snacks) using only basic pantry staples. 
    Strictly adhere to this veg preference: ${filters.isVeg ? 'Vegetarian ONLY' : 'Non-Veg allowed'}.`;
  } else {
    prompt = `Suggest 6 distinct Indian recipes based on these parameters:
    - Ingredients available: ${filters.ingredients || "Any"}
    - Meal Type: ${filters.mealType || "Any"}
    - Time Available: ${filters.timeLimit} minutes
    - Spice Level: ${filters.spiceLevel}
    - Cuisine Preference: ${filters.cuisine || "Any"}
    - Veg Preference: ${filters.isVeg ? 'Vegetarian ONLY' : 'Non-Veg allowed'}
    
    Ensure the recipes are authentic and diverse.`;
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema
        }
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as Recipe[];
  } catch (error) {
    console.error("Error generating recipes:", error);
    return [];
  }
};

export const generateWeeklyPlan = async (isVeg: boolean): Promise<WeeklyPlanDay[]> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `Generate a 7-day Indian meal plan (Monday to Sunday).
  
  Constraint:
  - Diet: ${isVeg ? "Vegetarian" : "Non-Vegetarian/Mixed"}
  - Integration: Incorporate Ayurvedic/Astrological dietary principles for days of the week (e.g., White food on Monday for Moon, Red lentils/protein on Tuesday for Mars, Green/Easy digestion on Wednesday for Mercury, Yellow/Heavy meal on Thursday for Jupiter, etc.).
  - Balance: Ensure nutritional balance.
  
  For each day, provide a short 'planetaryNote' explaining why these foods were chosen based on the day.
  Provide detailed recipe objects for Breakfast, Lunch, and Dinner.`;

  const dailyPlanSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      day: { type: Type.STRING },
      planetaryNote: { type: Type.STRING },
      breakfast: recipeSchema,
      lunch: recipeSchema,
      dinner: recipeSchema
    },
    required: ['day', 'planetaryNote', 'breakfast', 'lunch', 'dinner']
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: dailyPlanSchema
        }
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as WeeklyPlanDay[];
  } catch (error) {
    console.error("Error generating weekly plan:", error);
    return [];
  }
};

export const getTrendingRecipes = async (): Promise<Recipe[]> => {
   const model = "gemini-2.5-flash";
   const prompt = "Generate 4 currently trending or seasonal Indian recipes popular right now (e.g. winter specialties or monsoon snacks depending on general seasonality context). Make them diverse.";
   
   try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema
        }
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as Recipe[];
  } catch (error) {
    console.error("Error generating trending recipes:", error);
    return [];
  }
}
