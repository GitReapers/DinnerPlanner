import { useState } from 'react'
function Summary({text}) {
  const [expanded, setExpanded] = useState(false)
  const words = text.split(' ')
  const short = words.slice(0, 20).join(' ')
  const isLong = words.length > 20
return (
  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
    {expanded || !isLong ? text : `${short}…`}
      {isLong && (
        <button 
          onClick={()=>setExpanded(e=>!e)}>
          {expanded ? 'see less' : 'see more'}
        </button>
      )}
  </p>
)}

export default function RecipeDetail({ recipe, loading, onClose, onSave, onRemove, saved }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full overflow-y-auto rounded-2xl"
        style={{
          maxWidth: '520px',
          maxHeight: '90vh',
          background: 'var(--cream)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors"
          style={{ background: 'rgba(0,0,0,0.25)', color: '#fff' }}
        >
          ✕
        </button>

        {loading ? (
          <div className="flex items-center justify-center" style={{ height: 300 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</p>
          </div>
        ) : (
          <>
            {/* Hero image */}
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="w-full object-cover"
              style={{ height: 260 }}
            />

            {/* Content */}
            <div className="flex flex-col gap-4" style={{ padding: '1.5rem' }}>
              {/* Title + time */}
              <div className="flex flex-col gap-1">
                <h2
                  className="font-medium leading-snug"
                  style={{ fontSize: '1.25rem', color: 'var(--text)', letterSpacing: '-0.01em' }}
                >
                  {recipe.title}
                </h2>
                {recipe.readyInMinutes && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Ready in {recipe.readyInMinutes} min
                  </p>
                )}
              </div>

              {/* Summary */}
              {recipe.summary && (
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {recipe.summary && <Summary text={recipe.summary} />}
                </p>
              )}

               {recipe.extendedIngredients?.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Ingredients</p>
                    <ul className="flex flex-col gap-1">
                      {recipe.extendedIngredients.map((ing, i) => (
                        <li key={i} className="text-sm flex gap-2" style={{ color: 'var(--text-muted)' }}>
                          <span>·</span>
                          <span>{ing.amount} {ing.unit} {ing.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {recipe.analyzedInstructions?.length > 0 && (
                  <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Instructions</p>
                  <ol className="flex flex-col gap-3">
                    {recipe.analyzedInstructions[0].steps.map(step => (
                      <li key={step.number} className="flex gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                        <span
                          className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium"
                          style={{ background: 'var(--cream-darker)', color: 'var(--text)', marginTop: 1 }}
                        >
                          {step.number}
                        </span>
                        <span style={{ lineHeight: 1.6 }}>{step.step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                )}
              {/* Action buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => saved ? onRemove(recipe.recipeApiId) : onSave(recipe)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: saved ? 'var(--cream-darker)' : 'var(--text)',
                    color: saved ? 'var(--text-muted)' : 'var(--cream)',
                  }}
                >
                  {saved ? 'Unsave' : 'Save Recipe'}
                </button>

                {/* {recipe.sourceUrl && (
                  <a
                    href={recipe.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{
                      background: 'var(--green)',
                      color: 'var(--cream)',
                    }}
                  >
                    View Full Recipe
                  </a>
                )} */}
               
                
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
