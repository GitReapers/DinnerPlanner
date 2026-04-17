import { useState, useEffect, useCallback } from "react";
import { saveRecipe, deleteSavedRecipe, getSavedRecipes } from "../services/recipes";
import { useAuth } from "./useAuth";

export const useSavedRecipes = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  

  useEffect(() => {
    if (!user) return;
    getSavedRecipes(user.id).then((recipes) => {
      setSaved(recipes);
      setSavedIds(new Set(recipes.map((r) => String(r.recipe_api_id))))
    });
  }, [user]);

  const save = useCallback(async (recipe) => {
    if (!user || savedIds.has(recipe.recipeApiId)) return;
    const record = await saveRecipe(recipe, user.id);
    setSaved((prev) => [record, ...prev]);
    setSavedIds((prev) => new Set(prev).add(recipe.recipeApiId));
  }, [user, savedIds]);

  const remove = useCallback(async (recipeApiId) => {
    if (!user) return;
    await deleteSavedRecipe(recipeApiId, user.id);
    setSaved((prev) => prev.filter((r) => r.recipe_api_id !== recipeApiId));
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(recipeApiId);
      return next;
    });
  }, [user]);

  const isSaved = useCallback(
    (recipeApiId) => savedIds.has(recipeApiId),
    [savedIds]
  );

  return { saved, save, remove, isSaved };
};