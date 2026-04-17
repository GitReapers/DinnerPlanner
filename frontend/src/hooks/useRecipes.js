import { useState, useCallback } from "react";
import { findRecipesByIngredients } from "../services/spoonacular";
import { createRecipe } from "../models/Recipe";

export const useRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (ingredients) => {
    if (!ingredients.length) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await findRecipesByIngredients(ingredients);
      console.log(raw);
      setRecipes(raw.map(createRecipe));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const dismiss = useCallback((recipeApiId) => {
    setRecipes((prev) => prev.filter((r) => r.recipeApiId !== recipeApiId));
  }, []);

  return { recipes, loading, error, search, dismiss };
};