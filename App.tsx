import React, { useState, useEffect } from 'react';
import { 
  Search, ChefHat, Calendar, Flame, Timer, 
  UtensilsCrossed, Leaf, BeanOff, Sparkles, Filter 
} from 'lucide-react';

import { 
  Recipe, WeeklyPlanDay, SearchFilters, 
  SpiceLevel, MealType, Cuisine 
} from './types';
import * as geminiService from './services/geminiService';
import RecipeCard from './components/RecipeCard';
import RecipeModal from './components/RecipeModal';

function App() {
  // State
  const [activeTab, setActiveTab] = useState<'search' | 'planner' | 'trending'>('search');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanDay[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Filters State
  const [filters, setFilters] = useState<SearchFilters>({
    isVeg: true,
    ingredients: '',
    timeLimit: '30',
    spiceLevel: SpiceLevel.Medium,
    cuisine: '',
    mealType: ''
  });

  // Load trending on mount
  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoading(true);
    const results = await geminiService.getTrendingRecipes();
    setRecipes(results);
    setLoading(false);
  };

  const handleSearch = async (isIHaveNothing: boolean = false) => {
    setLoading(true);
    setActiveTab('search');
    setRecipes([]); // clear previous
    
    // Simulate slight delay for UX if API is too fast (rare)
    const results = await geminiService.suggestRecipes(filters, isIHaveNothing);
    setRecipes(results);
    setLoading(false);
  };

  const handleGeneratePlan = async () => {
    setActiveTab('planner');
    if (weeklyPlan.length > 0 && confirm("Regenerate plan? This will replace your current weekly plan.")) {
       // Proceed
    } else if (weeklyPlan.length > 0) {
       return;
    }

    setLoading(true);
    const plan = await geminiService.generateWeeklyPlan(filters.isVeg);
    setWeeklyPlan(plan);
    setLoading(false);
  };

  // UI Helper Components

  const NavItem = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center gap-1 p-2 w-20 transition-colors ${
        activeTab === id ? 'text-orange-600 font-medium' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <Icon size={24} strokeWidth={activeTab === id ? 2.5 : 2} />
      <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setActiveTab('search')}>
            <div className="bg-orange-500 text-white p-2 rounded-lg">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-none">Today's Meal</h1>
              <p className="text-xs text-orange-600 font-medium">Smart Indian Cooking</p>
            </div>
          </div>

          {/* Veg Toggle */}
          <button 
            onClick={() => setFilters(prev => ({ ...prev, isVeg: !prev.isVeg }))}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              filters.isVeg 
                ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' 
                : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
            }`}
          >
            {filters.isVeg ? <Leaf size={16} fill="currentColor" /> : <BeanOff size={16} />}
            <span className="text-sm font-semibold">{filters.isVeg ? 'Veg Only' : 'Non-Veg'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Search Tab Content */}
        {activeTab === 'search' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Hero / Filter Section */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-orange-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center md:text-left">
                  What should I cook today?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Ingredients Input */}
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input 
                      type="text"
                      placeholder="Enter ingredients (e.g., Potato, Paneer, Rice)..."
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-400 outline-none transition-all"
                      value={filters.ingredients}
                      onChange={(e) => setFilters({...filters, ingredients: e.target.value})}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
                    />
                  </div>

                  {/* Time Filter */}
                  <div className="relative">
                    <Timer className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-orange-200 outline-none"
                      value={filters.timeLimit}
                      onChange={(e) => setFilters({...filters, timeLimit: e.target.value})}
                    >
                      <option value="15">Under 15 mins</option>
                      <option value="30">Under 30 mins</option>
                      <option value="45">Under 45 mins</option>
                      <option value="60">1 Hour+</option>
                    </select>
                  </div>

                  {/* Cuisine/Type Filter (Combined for simplicity in mobile) */}
                  <div className="relative">
                    <UtensilsCrossed className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <select 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-orange-200 outline-none"
                      value={filters.cuisine}
                      onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                    >
                      <option value="">Any Cuisine</option>
                      {Object.values(Cuisine).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => handleSearch(false)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-orange-200 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? 'Thinking...' : 'Find Recipes'} <Sparkles size={18} />
                  </button>
                  
                  <button 
                    onClick={() => handleSearch(true)}
                    className="flex-1 sm:flex-none sm:w-48 bg-white border-2 border-orange-100 text-orange-600 font-semibold py-3.5 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    I Have Nothing
                  </button>
                </div>
              </div>
            </div>

            {/* Tags / Quick Filters */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
               {['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Tiffin'].map((type) => (
                 <button 
                    key={type}
                    onClick={() => setFilters(prev => ({...prev, mealType: prev.mealType === type ? '' : type}))}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                      filters.mealType === type 
                      ? 'bg-gray-800 text-white border-gray-800' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                 >
                   {type}
                 </button>
               ))}
            </div>

            {/* Results Grid */}
            {loading && (
              <div className="py-20 text-center">
                 <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-500 animate-pulse">Consulting the digital chef...</p>
              </div>
            )}

            {!loading && recipes.length > 0 && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {recipes.map((recipe, idx) => (
                   <RecipeCard key={idx} recipe={recipe} onClick={setSelectedRecipe} />
                 ))}
               </div>
            )}

            {!loading && recipes.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <ChefHat className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900">Ready to cook?</h3>
                <p className="text-gray-500">Enter ingredients or select filters to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* Planner Tab Content */}
        {activeTab === 'planner' && (
          <div className="animate-fadeIn space-y-6">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-gray-800">Weekly Meal Plan</h2>
               <button 
                onClick={handleGeneratePlan}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                disabled={loading}
               >
                 {weeklyPlan.length > 0 ? 'Regenerate Plan' : 'Generate Plan'} <Sparkles size={16} />
               </button>
            </div>

            {loading && (
               <div className="py-20 text-center">
                 <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-500 animate-pulse">Aligning with the stars & science...</p>
              </div>
            )}

            {!loading && weeklyPlan.length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900">Plan your week</h3>
                <p className="text-gray-500 max-w-md mx-auto mt-2">
                  Get a 7-day plan based on science and astrology (e.g., Moon days, Protein days).
                </p>
                <button 
                  onClick={handleGeneratePlan} 
                  className="mt-6 text-indigo-600 font-semibold hover:underline"
                >
                  Generate Now
                </button>
              </div>
            )}

            <div className="grid gap-6">
              {weeklyPlan.map((day, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <h3 className="text-lg font-bold text-indigo-900">{day.day}</h3>
                    <div className="flex items-center gap-2 text-xs text-indigo-700 bg-white px-3 py-1 rounded-full shadow-sm">
                      <Sparkles size={12} />
                      {day.planetaryNote}
                    </div>
                  </div>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Breakfast */}
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
                      onClick={() => setSelectedRecipe(day.breakfast)}
                    >
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">Breakfast</span>
                      <div className="font-bold text-gray-800">{day.breakfast.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{day.breakfast.calories} kcal • {day.breakfast.cookingTime}</div>
                    </div>
                    {/* Lunch */}
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors md:border-l md:border-r border-gray-100 md:px-6"
                      onClick={() => setSelectedRecipe(day.lunch)}
                    >
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">Lunch</span>
                      <div className="font-bold text-gray-800">{day.lunch.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{day.lunch.calories} kcal • {day.lunch.cookingTime}</div>
                    </div>
                    {/* Dinner */}
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
                      onClick={() => setSelectedRecipe(day.dinner)}
                    >
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block mb-1">Dinner</span>
                      <div className="font-bold text-gray-800">{day.dinner.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{day.dinner.calories} kcal • {day.dinner.cookingTime}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

         {/* Trending Tab Content */}
         {activeTab === 'trending' && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Trending Now in India</h2>
             {loading ? (
              <div className="py-20 text-center">
                 <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {recipes.map((recipe, idx) => (
                   <RecipeCard key={idx} recipe={recipe} onClick={setSelectedRecipe} />
                 ))}
               </div>
            )}
          </div>
        )}

      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 z-40 safe-area-pb">
        <NavItem id="search" label="Cook" icon={ChefHat} />
        <NavItem id="planner" label="Plan" icon={Calendar} />
        <NavItem id="trending" label="Trending" icon={Flame} />
      </nav>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </div>
  );
}

export default App;