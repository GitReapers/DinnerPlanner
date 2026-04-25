import { useDroppable } from '@dnd-kit/core'

export default function Basket({ items, onRemove, onSearch, loading }) {
    const { setNodeRef, isOver } = useDroppable({ id: 'basket' })

    return (
        <div className="basket-wrap">
        <p className="basket-title">Dinner Basket</p>

        <div
            ref={setNodeRef}
            className={`basket-zone ${isOver ? 'over' : ''}`}
        >
            {items.length === 0 ? (
            <div className="basket-empty">Drag items in here</div>
            ) : (
            items.map(item => (
                <span key={item.id} className="basket-chip">
                <span style={{ fontSize: 13 }}>{item.emoji}</span>
                {item.name}
                <span
                    className="basket-chip-remove"
                    onClick={() => onRemove(item.id)}
                >×</span>
                </span>
            ))
            )}
        </div>

        <button
            className="search-btn"
            onClick={onSearch}
            disabled={items.length < 2 || loading}
        >
            {loading ? 'Searching…' : 'Search Recipe'}
        </button>
        </div>
    )
}