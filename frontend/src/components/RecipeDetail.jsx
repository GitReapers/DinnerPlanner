export default function RecipeDetail({ recipe, loading, onClose, onSave, onRemove, saved }) {
    console.log(saved);
    return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <img className="modal-img" src={recipe.imageUrl} alt={recipe.title} />
            <div className="modal-body">
              <h2>{recipe.title}</h2>
              {recipe.readyInMinutes && <p>{recipe.readyInMinutes} min</p>}
              {recipe.summary && (
                <p className="modal-summary">{recipe.summary}</p>
              )}
              <div className="modal-actions">
                {saved ? (
                  <button onClick={() => onRemove(recipe.recipeApiId)}>Unsave</button>
                ) : (
                  <button onClick={() => onSave(recipe)}>Save Recipe</button>
                )}
                {recipe.sourceUrl && (
                  <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                    View Full Recipe
                  </a>
                )}
              </div>
            </div>
            <button className="modal-close" onClick={onClose}>✕</button>
          </>
        )}
      </div>
    </div>
  )
}