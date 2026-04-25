export default function RecipeCard({ recipe, onSave, onDismiss, onExpand, saved }) {
    return (
        <div className={`recipe-card ${saved ? 'saved-card' : ''}`}
            onClick={() => onExpand?.(recipe.recipeApiId)}
        >
            <img
                className="recipe-img"
                src={recipe.imageUrl}
                alt={recipe.title}
            />

            <div className="recipe-info">
                <div className="recipe-name">{recipe.title}</div>
                {recipe.usedIngredients.length > 0 &&
                    <div className="recipe-meta">
                        Used: {recipe.usedIngredients.length} &nbsp;·&nbsp; Missing:{" "}
                        {recipe.missedIngredients.length}
                    </div>
                }

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
                            onClick={() => onDismiss(recipe.recipeApiId)}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}