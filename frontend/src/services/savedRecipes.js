// Service for managing saved recipes.
// Currently uses localStorage for persistence.
// To swap to Supabase: Replace localStorage calls with API fetches (e.g., fetch('/api/saved-recipes')).

export const getSavedRecipes = async () => {
  try {
    const saved = localStorage.getItem('savedRecipes');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved recipes:', error);
    throw new Error('Failed to load saved recipes');
  }
};

export const saveRecipe = async (recipe) => {
  try {
    const saved = await getSavedRecipes();
    if (!saved.find(r => r.id === recipe.id)) {
      saved.push(recipe);
      localStorage.setItem('savedRecipes', JSON.stringify(saved));
    }
  } catch (error) {
    console.error('Error saving recipe:', error);
    throw new Error('Failed to save recipe');
  }
};

export const deleteRecipe = async (id) => {
  try {
    const saved = await getSavedRecipes();
    const filtered = saved.filter(r => r.id !== id);
    localStorage.setItem('savedRecipes', JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw new Error('Failed to delete recipe');
  }
};