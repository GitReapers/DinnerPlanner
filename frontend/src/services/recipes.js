import { supabase } from "../lib/supabase";
import { toDbRecord } from "../models/Recipe";

export const saveRecipe = async (recipe, userId) => {
  const { data, error } = await supabase
    .from("recipes")
    .insert(toDbRecord(recipe, userId))
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteSavedRecipe = async (recipeApiId, userId) => {
  const { error } = await supabase
    .from("recipes")
    .delete()
    .eq("recipe_api_id", recipeApiId)
    .eq("user_id", userId);

  if (error) throw error;
};

export const getSavedRecipes = async (userId) => {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("user_id", userId)
    .order("saved_at", { ascending: false });

  if (error) throw error;

  return data.map((r) => ({
    ...r,
    recipe_api_id: String(r.recipe_api_id), // normalize ids to strings
  }));
};