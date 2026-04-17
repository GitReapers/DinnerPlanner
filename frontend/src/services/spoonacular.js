const BASE_URL = "https://api.spoonacular.com";
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;

const get = async (endpoint, params = {}) => {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.set("apiKey", API_KEY);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Spoonacular error: ${res.status}`);
    return res.json();
};


export const findRecipesByIngredients = (ingredients, opts = {}) =>
    get("/recipes/findByIngredients", {
        ingredients: ingredients.join(","),
        number: opts.number ?? 20,
        ranking: 1,        // maximize used ingredients
        ignorePantry: true,
        ...opts,
    });


export const getRecipeDetails = (id) =>
    get(`/recipes/${id}/information`, { includeNutrition: false });