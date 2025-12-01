import React from 'react';
import { Clock, Flame, ChefHat, ArrowRight } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick }) => {
  // Generate a reliable placeholder image based on keyword or random hash if missing
  const imageUrl = recipe.imageKeyword 
    ? `https://picsum.photos/seed/${recipe.imageKeyword.replace(/\s/g, '')}/400/300` 
    : `https://picsum.photos/seed/${recipe.name.replace(/\s/g, '')}/400/300`;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={recipe.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
          {recipe.cuisine}
        </div>
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold shadow-sm ${recipe.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {recipe.isVeg ? 'VEG' : 'NON-VEG'}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{recipe.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 mt-auto">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
            <Clock size={14} className="text-orange-500" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
             <ChefHat size={14} className="text-blue-500" />
             <span>{recipe.difficulty}</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
            <Flame size={14} className="text-red-500" />
            <span>{recipe.calories} kcal</span>
          </div>
        </div>

        <button 
          onClick={() => onClick(recipe)}
          className="w-full bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
        >
          View Recipe <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;