export const createRecipe = (raw) => ({
  recipeApiId: String(raw.id),
  title: raw.title,
  imageUrl: raw.image,
  sourceUrl: raw.sourceUrl ?? raw.spoonacularSourceUrl ?? null,
  summary: raw.summary?.replace(/<[^>]+>/g, "") ?? "",
  readyInMinutes: raw.readyInMinutes ?? null,                    
  analyzedInstructions: raw.analyzedInstructions ?? [],
  usedIngredients: raw.usedIngredients?.map((i) => i.name) ?? [],
  missedIngredients: raw.missedIngredients?.map((i) => i.name) ?? [],
  extendedIngredients: raw.extendedIngredients?.map(i => ({
    name: i.name,
    amount: i.amount,
    unit: i.unit,
  })) ?? [],
});

// columns expected by the recipes db table
export const toDbRecord = (recipe, userId) => ({
  user_id: userId,
  recipe_api_id: recipe.recipeApiId,
  title: recipe.title,
  image_url: recipe.imageUrl,
  source_url: recipe.sourceUrl,
  ready_in_minutes: recipe.readyInMinutes
});