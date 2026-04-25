import { useState } from 'react'

export default function RecipeStack({ recipes, onSave, onDismiss, onExpand }) {
  const [index, setIndex] = useState(0)

  if (!recipes.length) return null

  const advance = () => setIndex(i => i + 1)

  if (index >= recipes.length) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 w-[360px]">
        <div className="text-5xl">🍽️</div>
        <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
          You've seen all {recipes.length} recipes!
        </p>
        <button
          className="text-sm underline underline-offset-2"
          style={{ color: 'var(--green)' }}
          onClick={() => setIndex(0)}
        >
          Start over
        </button>
      </div>
    )
  }

  const current = recipes[index]
  const behind1 = recipes[index + 1]
  const behind2 = recipes[index + 2]

  return (
    <div className="flex flex-col items-center gap-4" style={{ width: 360 }}>
      {/* Counter */}
      <div
        className="self-end text-xs tracking-widest uppercase pr-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {index + 1} / {recipes.length}
      </div>

      {/* Card stack */}
      <div className="card-stack">
        {behind2 && (
          <div className="stack-card stack-pos-2">
            <img src={behind2.imageUrl} alt="" className="stack-img" />
          </div>
        )}
        {behind1 && (
          <div className="stack-card stack-pos-1">
            <img src={behind1.imageUrl} alt="" className="stack-img" />
          </div>
        )}
        <div
          className="stack-card stack-pos-0 stack-card-interactive"
          onClick={() => onExpand(current.recipeApiId)}
        >
          <img src={current.imageUrl} alt={current.title} className="stack-img" />
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 500, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
              {current.title}
            </p>
            {current.usedIngredients?.length > 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Uses {current.usedIngredients.length} ingredient
                {current.usedIngredients.length !== 1 ? 's' : ''} you have
                {current.missedIngredients.length > 0
                  ? ` · missing ${current.missedIngredients.length}`
                  : ''}
              </p>
            )}
            <p style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.5 }}>
              Click for full details
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-8 mt-1">
        <button
          className="action-btn dismiss"
          style={{ width: 52, height: 52, fontSize: 18 }}
          title="Skip"
          onClick={() => { onDismiss(current.recipeApiId); advance() }}
        >
          ✕
        </button>
        <button
          className="action-btn save"
          style={{ width: 52, height: 52, fontSize: 20 }}
          title="Save recipe"
          onClick={() => { onSave(current); advance() }}
        >
          ★
        </button>
      </div>
    </div>
  )
}
