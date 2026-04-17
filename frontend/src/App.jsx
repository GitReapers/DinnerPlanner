import { useState } from 'react'
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { signOut } from './lib/auth'
import { useRecipes } from './hooks/useRecipes'
import { useSavedRecipes } from './hooks/useSavedRecipes'
import { useAuth } from './hooks/useAuth'
import { useRecipeDetail } from './hooks/useRecipeDetail'
import Fridge from './components/Fridge'
import Basket from './components/Basket'
import RecipeCard from './components/RecipeCard'
import RecipeDetail from './components/RecipeDetail'
import Auth from './components/Auth'
import './App.css'

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
  const { user, loadingUser } = useAuth()
  const { recipes, loading, error, search, dismiss } = useRecipes()
  const { saved, save, remove, isSaved } = useSavedRecipes()
  const { detail, loading: detailLoading, fetch: fetchDetail, clear: clearDetail } = useRecipeDetail()

  const [view, setView] = useState('fridge') // 'fridge' | 'saved'
  const [shelves, setShelves] = useState(INITIAL_SHELVES)
  const [basket, setBasket] = useState([])
  const [activeItem, setActiveItem] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }))

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
    const ingredientNames = basket.map(item => item.name)
    search(ingredientNames)
  }

  if (loadingUser) return <div className="loading-screen">Loading...</div>
  if (!user) return <Auth />

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
              <button className={`nav-link ${view === 'fridge' ? 'active' : ''}`} onClick={() => setView('fridge')}>Get Ingredients</button>
              <button className={`nav-link ${view === 'saved' ? 'active' : ''}`} onClick={() => setView('saved')}>Saved Recipes {saved.length > 0 && <span className="nav-badge">{saved.length}</span>}</button>
            </nav>
            <button onClick={signOut} className="logout-btn">
              Logout
            </button>
          </header>

          <main className="app-main">

            {view === 'fridge' && (
            <>
            <section className="left-panel">
              <Fridge basket={basket} shelves={shelves} onDelete={deleteFromFridge} />
            </section>

            <section className="right-panel">
              <Basket items={basket} onRemove={removeFromBasket} onSearch={handleSearch} loading={loading} />

              {error && <p className="error-msg">{error}</p>}

              {recipes.length > 0 && (
                <div className="recipe-results">
                  {recipes.map(recipe => (
                    <RecipeCard
                      key={recipe.recipeApiId}
                      recipe={recipe}
                      onSave={save}
                      onDismiss={dismiss}
                      onExpand={fetchDetail}
                      saved={isSaved(recipe.recipeApiId)}
                    />
                  ))}
                </div>
              )}
            </section>
            </>
            )}
            {view === 'saved' && (
            <section className="saved-view">
              {saved.length === 0 ? (
                <p className="empty-msg">No saved recipes yet. Find some ingredients and start cooking!</p>
              ) : (
                <div className="saved-grid">
                  {saved.map(recipe => (
          
                    <RecipeCard
                      key={recipe.recipe_api_id}
                      recipe={{
                        recipeApiId: recipe.recipe_api_id,
                        title: recipe.title,
                        imageUrl: recipe.image_url,
                        usedIngredients: [],
                        missedIngredients: [],
                      }}
                      saved
                      onDismiss={remove}
                      onExpand={fetchDetail}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
          </main>

        {/* Recipe detail modal — triggered from either view */}
        {detail && (
          <RecipeDetail
            recipe={detail}
            loading={detailLoading}
            onClose={clearDetail}
            onSave={save}
            onRemove={remove}
            saved={isSaved(detail.recipeApiId)}
          />
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