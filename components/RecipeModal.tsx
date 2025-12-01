import React from 'react';
import { X, Youtube, Clock, Users, Flame, CheckCircle } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  const imageUrl = recipe.imageKeyword 
  ? `https://picsum.photos/seed/${recipe.imageKeyword.replace(/\s/g, '')}/800/400` 
  : `https://picsum.photos/seed/${recipe.name.replace(/\s/g, '')}/800/400`;

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.name + " recipe")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white text-gray-700 shadow-md transition-all"
        >
          <X size={24} />
        </button>

        <div className="relative h-64 md:h-80 w-full">
           <img 
            src={imageUrl} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
           <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full mb-2 inline-block ${recipe.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {recipe.isVeg ? 'VEG' : 'NON-VEG'}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">{recipe.name}</h2>
              </div>
           </div>
        </div>

        <div className="p-6 md:p-10">
          <div className="flex flex-wrap gap-4 mb-8 text-sm font-medium text-gray-600 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-2">
              <Clock className="text-orange-500" size={18} />
              {recipe.cookingTime}
            </div>
            <div className="flex items-center gap-2">
              <Flame className="text-red-500" size={18} />
              {recipe.calories} kcal
            </div>
            <div className="flex items-center gap-2">
              <Users className="text-blue-500" size={18} />
              2-3 Servings
            </div>
             <a 
              href={youtubeSearchUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-red-600 hover:text-red-700 ml-auto"
            >
              <Youtube size={20} />
              Watch Video
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                Ingredients
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
              <div className="space-y-6">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-600 leading-relaxed mt-1">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100 flex gap-3 items-start">
                 <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                 <div>
                   <h4 className="font-semibold text-green-800 text-sm">Missing Ingredients?</h4>
                   <p className="text-green-700 text-xs mt-1">
                     Don't worry! You can usually substitute vegetables or skip non-essential garnishes like coriander. Cooking is an art, not a rulebook.
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;