import { useState, useEffect } from 'react';
import { getSavedRecipes, deleteRecipe } from '../services/savedRecipes';
import RecipeCard from './RecipeCard';

export default function SavedRecipes({ onBack }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const saved = await getSavedRecipes();
        setRecipes(saved);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRecipe(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading saved recipes...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (recipes.length === 0) return <div className="text-center py-8">No saved recipes yet. Save some recipes to see them here!</div>;

  return (
    <div className="saved-recipes p-4">
      <button onClick={onBack} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Back to Ingredients</button>
      <h2 className="text-2xl font-bold mb-4">Saved Recipes</h2>
      <div className="grid gap-4">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} onDelete={handleDelete} saved />
        ))}
      </div>
    </div>
  );
}