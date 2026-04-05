import { useState } from 'react'
import { DndContext, DragOverlay, pointerWithin } from '@dnd-kit/core'
import Fridge from './components/Fridge'
import Basket from './components/Basket'
import RecipeCard from './components/RecipeCard'
import './App.css'


const MOCK_RECIPES = [
  {
    id: 1,
    title: 'Tomato Pasta',
    image: 'https://placehold.co/80x80/e8d5c4/7a5c44?text=🍝',
    totalIngredients: 6,
    totalTime: 25,
  },
  {
    id: 2,
    title: 'Egg Fried Rice',
    image: 'https://placehold.co/80x80/d4e8c4/4a7a44?text=🍳',
    totalIngredients: 5,
    totalTime: 15,
  },
]

export default function App() {
  const [basket, setBasket] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(false)

  function handleDragStart(event) {
    setActiveItem(event.active.data.current)
  }

  function handleDragEnd(event) {
    const { over, active } = event
    setActiveItem(null)
    if (over?.id === 'basket') {
      const item = active.data.current
      if (!basket.find(b => b.id === item.id)) {
        setBasket(prev => [...prev, item])
      }
    }
  }

  function removeFromBasket(id) {
    setBasket(prev => prev.filter(b => b.id !== id))
  }

  function handleSearch() {
    if (basket.length < 2) return
    setLoading(true)
    // TODO: replace with real Spoonacular API call via Rails
    setTimeout(() => {
      setRecipes(MOCK_RECIPES)
      setLoading(false)
    }, 800)
  }

  function saveRecipe(recipe) {
    if (!savedRecipes.find(r => r.id === recipe.id)) {
      setSavedRecipes(prev => [...prev, recipe])
    }
    setRecipes(prev => prev.filter(r => r.id !== recipe.id))
  }

  function dismissRecipe(id) {
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-layout">
        <header className="app-header">
          <span className="app-logo">DinnerDrop</span>
          <nav className="app-nav">
            <button className="nav-link active">Get Ingredients</button>
            <button className="nav-link">Saved Recipes</button>
          </nav>
        </header>

        <main className="app-main">
          <section className="left-panel">
            <Fridge basket={basket} />
          </section>

          <section className="right-panel">
            <Basket
              items={basket}
              onRemove={removeFromBasket}
              onSearch={handleSearch}
              loading={loading}
            />

            {recipes.length > 0 && (
              <div className="recipe-results">
                {recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onSave={saveRecipe}
                    onDismiss={dismissRecipe}
                  />
                ))}
              </div>
            )}

            {savedRecipes.length > 0 && (
              <div className="saved-section">
                <p className="saved-label">Saved</p>
                {savedRecipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    saved
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="ingredient-chip dragging-overlay">
            {activeItem.emoji} {activeItem.name}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}