import { useState, useCallback, useRef } from "react";
import { getRecipeDetails } from "../services/spoonacular";
import { createRecipe } from "../models/Recipe";

export const useRecipeDetail = () => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const cache = useRef({});

  const fetch = useCallback(async (recipeApiId) => {
    if (cache.current[recipeApiId]) {
      setDetail(cache.current[recipeApiId]);
      return;
    }
    setLoading(true);
    try {
      const raw = await getRecipeDetails(recipeApiId);
      const normalized = createRecipe(raw);
      cache.current[recipeApiId] = normalized;
      setDetail(normalized);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => setDetail(null), []);

  return { detail, loading, fetch, clear };
};