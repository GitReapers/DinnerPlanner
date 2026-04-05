export default function RecipeCard({ recipe, onSave, onDismiss, saved }) {
  return (
    <div className={`recipe-card ${saved ? 'saved-card' : ''}`}>
    <img
        className="recipe-img"
        src={recipe.image}
        alt={recipe.title}
    />

        <div className="recipe-info">
            <div className="recipe-name">{recipe.title}</div>
            <div className="recipe-meta">
            Total Ingredients: {recipe.totalIngredients} &nbsp;·&nbsp; Total time: {recipe.totalTime} min
            </div>

            {!saved && (
            <div className="recipe-actions">
                <button
                className="action-btn save"
                title="Save recipe"
                onClick={() => onSave(recipe)}
                >
                ★
                </button>
                <button
                className="action-btn dismiss"
                title="Dismiss"
                onClick={() => onDismiss(recipe.id)}
                >
                ✕
                </button>
            </div>
            )}
        </div>
    </div>
)
}