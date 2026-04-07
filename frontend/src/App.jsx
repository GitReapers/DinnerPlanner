import { useState, useEffect } from 'react'
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Fridge from './components/Fridge'
import Basket from './components/Basket'
import RecipeCard from './components/RecipeCard'
import SavedRecipes from './components/SavedRecipes'
import { getSavedRecipes, saveRecipe as saveRecipeService } from './services/savedRecipes'
import './App.css'

const MOCK_RECIPES = [
  { id: 1, title: 'Tomato Pasta', image: 'https://placehold.co/80x80/e8d5c4/7a5c44?text=🍝', totalIngredients: 6, totalTime: 25 },
  { id: 2, title: 'Egg Fried Rice', image: 'https://placehold.co/80x80/d4e8c4/4a7a44?text=🍳', totalIngredients: 5, totalTime: 15 },
]

export const INITIAL_SHELVES = {
  freezer: [
    { id: 'icecream', name: 'Ice Cream', emoji: '🍦' },
    { id: 'frozen-peas', name: 'Frozen Peas', emoji: '🫛' },
    { id: 'frozen-beef', name: 'Ground Beef', emoji: '🥩' },
  ],
  top: [
    { id: 'milk', name: 'Milk', emoji: '🥛' },
    { id: 'greek-yogurt', name: 'Greek Yogurt', emoji: '🫙' },
    { id: 'cheese', name: 'Cheese', emoji: '🧀' },
  ],
  low: [
    { id: 'eggs', name: 'Eggs', emoji: '🥚' },
    { id: 'tofu', name: 'Tofu', emoji: '⬜' },
    { id: 'tomato', name: 'Tomato', emoji: '🍅' },
    { id: 'pasta', name: 'Pasta', emoji: '🍝' },
  ],
  produce: [
    { id: 'spinach', name: 'Spinach', emoji: '🥬' },
    { id: 'carrot', name: 'Carrot', emoji: '🥕' },
  ],
  fruit: [
    { id: 'avocado', name: 'Avocado', emoji: '🥑' },
    { id: 'apple', name: 'Apple', emoji: '🍎' },
  ],
  freezer_tray: [
    { id: 'ice', name: 'Ice', emoji: '🧊' },
    { id: 'popsicle', name: 'Popsicle', emoji: '🍡' },
  ],
  tray_condiments: [
    { id: 'mustard', name: 'Mustard', emoji: '🟡' },
    { id: 'hot-sauce', name: 'Hot Sauce', emoji: '🌶️' },
  ],
  tray_drinks: [
    { id: 'oj', name: 'Orange Juice', emoji: '🍊' },
    { id: 'milk2', name: 'Almond Milk', emoji: '🥛' },
  ],
  tray_eggs: [
    { id: 'egg1', name: 'Egg', emoji: '🥚' },
    { id: 'egg2', name: 'Egg', emoji: '🥚' },
  ],
}

const TRAY_ZONES = ['freezer_tray', 'tray_condiments', 'tray_drinks', 'tray_eggs']
const SHELF_ZONES = ['freezer', 'top', 'low', 'produce', 'fruit']
const TRAY_MAX = 3
const SHELF_MAX = 6

export default function App() {
  const [shelves, setShelves] = useState(INITIAL_SHELVES)
  const [basket, setBasket] = useState([])
  const [activeItem, setActiveItem] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentView, setCurrentView] = useState('ingredients') // New: For navigation

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }))

  // New: Load saved recipes from localStorage on app start
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const saved = await getSavedRecipes()
        setSavedRecipes(saved)
      } catch (error) {
        console.error('Error loading saved recipes:', error)
      }
    }
    loadSaved()
  }, [])

  function findZone(itemId) {
    return Object.keys(shelves).find(key => shelves[key].some(i => i.id === itemId))
  }

  function handleDragStart(event) {
    const zone = findZone(event.active.id)
    const item = zone
      ? shelves[zone].find(i => i.id === event.active.id)
      : event.active.data.current
    setActiveItem(item)
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveItem(null)
    if (!over) return

    // ── drop into basket ──
    if (over.id === 'basket') {
      const item = active.data.current
      if (item && !basket.find(b => b.id === item.id)) {
        setBasket(prev => [...prev, item])
      }
      return
    }

    // ── fridge rearrange ──
    const fromZone = findZone(active.id)
    const toZone = shelves[over.id] ? over.id : findZone(over.id)
    if (!fromZone || !toZone) return

    if (fromZone === toZone) {
      setShelves(prev => {
        const items = prev[fromZone]
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return { ...prev, [fromZone]: arrayMove(items, oldIndex, newIndex) }
      })
    } else {
      setShelves(prev => {
        const item = prev[fromZone].find(i => i.id === active.id)
        const toIndex = prev[toZone].findIndex(i => i.id === over.id)
        const newFrom = prev[fromZone].filter(i => i.id !== active.id)
        const newTo = [...prev[toZone]]
        newTo.splice(toIndex >= 0 ? toIndex : newTo.length, 0, item)
        return { ...prev, [fromZone]: newFrom, [toZone]: newTo }
      })
    }

    // ── tray overflow ──
    if (TRAY_ZONES.includes(toZone)) {
      setShelves(prev => {
        const tray = prev[toZone]
        if (tray.length <= TRAY_MAX) return prev
        const overflow = tray[tray.length - 1]
        const trimmedTray = tray.slice(0, TRAY_MAX)
        const freeShelf = SHELF_ZONES.find(z => prev[z].length < SHELF_MAX)
        if (freeShelf) {
          return { ...prev, [toZone]: trimmedTray, [freeShelf]: [...prev[freeShelf], overflow] }
        }
        return { ...prev, [toZone]: trimmedTray }
      })
    }
  }

  function deleteFromFridge(id) {
    setShelves(prev => {
      const zone = Object.keys(prev).find(k => prev[k].some(i => i.id === id))
      if (!zone) return prev
      return { ...prev, [zone]: prev[zone].filter(i => i.id !== id) }
    })
  }

  function removeFromBasket(id) {
    setBasket(prev => prev.filter(b => b.id !== id))
  }

  function handleSearch() {
    if (basket.length < 2) return
    setLoading(true)
    setTimeout(() => { setRecipes(MOCK_RECIPES); setLoading(false) }, 800)
  }

  // Updated: Now async and uses service for persistence
  async function saveRecipe(recipe) {
    if (!savedRecipes.find(r => r.id === recipe.id)) {
      const newSaved = [...savedRecipes, recipe]
      setSavedRecipes(newSaved)
      try {
        await saveRecipeService(recipe)
      } catch (error) {
        console.error('Error saving recipe:', error)
        // Optionally revert state on error
      }
    }
    setRecipes(prev => prev.filter(r => r.id !== recipe.id))
  }

  function dismissRecipe(id) {
    setRecipes(prev => prev.filter(r => r.id !== id))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <div className="app-layout">
          <header className="app-header">
            <span className="app-logo">DinnerDrop</span>
            <nav className="app-nav">
              <button
                className={`nav-link ${currentView === 'ingredients' ? 'active' : ''}`}
                onClick={() => setCurrentView('ingredients')}
              >
                Get Ingredients
              </button>
              <button
                className={`nav-link ${currentView === 'saved' ? 'active' : ''}`}
                onClick={() => setCurrentView('saved')}
              >
                Saved Recipes
              </button>
            </nav>
          </header>

          {currentView === 'ingredients' ? (
            <main className="app-main">
              <section className="left-panel">
                <Fridge basket={basket} shelves={shelves} onDelete={deleteFromFridge} />
              </section>

              <section className="right-panel">
                <Basket items={basket} onRemove={removeFromBasket} onSearch={handleSearch} loading={loading} />

                {recipes.length > 0 && (
                  <div className="recipe-results">
                    {recipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} onSave={saveRecipe} onDismiss={dismissRecipe} />
                    ))}
                  </div>
                )}

                {savedRecipes.length > 0 && (
                  <div className="saved-section">
                    <p className="saved-label">Saved</p>
                    {savedRecipes.map(recipe => (
                      <RecipeCard key={recipe.id} recipe={recipe} saved />
                    ))}
                  </div>
                )}
              </section>
            </main>
          ) : (
            <main className="app-main">
              <SavedRecipes onBack={() => setCurrentView('ingredients')} />
            </main>
          )}
        </div>

        <DragOverlay>
          {activeItem && (
            <div className="ingredient-chip dragging-overlay">
              <span style={{ fontSize: 14 }}>{activeItem.emoji}</span>
              {activeItem.name}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  )
}