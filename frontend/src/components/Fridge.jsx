import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'


const FREEZER_ITEMS = [
    { id: 'icecream', name: 'Ice Cream', emoji: '🍦' },
    { id: 'frozen-peas', name: 'Frozen Peas', emoji: '🫛' },
    { id: 'frozen-beef', name: 'Ground Beef', emoji: '🥩' },
]

const SHELVES = [
    {
    id: 'top',
    items: [
    { id: 'milk', name: 'Milk', emoji: '🥛' },
    { id: 'greek-yogurt', name: 'Greek Yogurt', emoji: '🫙' },
    { id: 'cheese', name: 'Cheese', emoji: '🧀' },
    ],
    },
    {
    id: 'mid',
    items: [
        { id: 'eggs', name: 'Eggs', emoji: '🥚' },
        { id: 'tofu', name: 'Tofu', emoji: '⬜' },
        { id: 'tomato', name: 'Tomato', emoji: '🍅' },
        { id: 'pasta', name: 'Pasta', emoji: '🍝' },
    ],
  },
  {
    id: 'low',
    items: [
        { id: 'butter', name: 'Butter', emoji: '🧈' },
        { id: 'garlic', name: 'Garlic', emoji: '🧄' },
        { id: 'lemon', name: 'Lemon', emoji: '🍋' },
    ],
  },
]

const DRAWERS = [
  {
    id: 'produce',
    items: [
        { id: 'spinach', name: 'Spinach', emoji: '🥬' },
        { id: 'carrot', name: 'Carrot',  emoji: '🥕' },
    ],
  },
  {
    id: 'condiments',
    items: [
        { id: 'soysauce', name: 'Soy Sauce', emoji: '🫙' },
    ],
  },
]

function Chip({ item, inBasket }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: item,
  })

    const style = transform && !inBasket
        ? { transform: `translate(${transform.x}px, ${transform.y}px)`, zIndex: 999, position: 'relative' }
        : undefined

    return (
        <div
        ref={setNodeRef}
        style={style}
        className={`ingredient-chip ${inBasket ? 'in-basket' : ''} ${isDragging ? 'dragging' : ''}`}
        {...listeners}
        {...attributes}
        >
        <span style={{ fontSize: 14 }}>{item.emoji}</span>
        {item.name}
        </div>
)
}

function Door({ isOpen, onToggle, handleHeight, trays, sceneClass }) {
    return (
    <div className={`door-scene ${sceneClass}`}>
        <div className={`door ${isOpen ? 'open' : ''}`} onClick={onToggle}>
            <div className="door-front">
                <div className="door-handle" style={{ height: handleHeight }} />
                <div className="door-hint">click to open</div>
            </div>
            <div className="door-back">
                {trays.map((tray, i) => (
                    <div key={i} className="door-tray">{tray}</div>
                ))}
            </div>
        </div>
    </div>
)
}

export default function Fridge({ basket }) {
    const [freezerOpen, setFreezerOpen] = useState(false)
    const [fridgeOpen, setFridgeOpen]   = useState(false)
    
    const basketIds = new Set(basket.map(b => b.id))

    return (
        <div className="fridge">

        {/* ── Freezer ── */}
        <div className="fridge-section freezer">
            <div className="fridge-contents">
            <div className="shelf">
                <div className="shelf-items">
                {FREEZER_ITEMS.map(item => (
                    <Chip key={item.id} item={item} inBasket={basketIds.has(item.id)} />
                ))}
                </div>
                <div className="shelf-bar" />
            </div>
            </div>
            <Door
            isOpen={freezerOpen}
            onToggle={() => setFreezerOpen(o => !o)}
            handleHeight="50px"
            trays={['ice tray']}
            sceneClass="freezer-scene"
            />
        </div>

        {/* ── Main fridge ── */}
        <div className="fridge-section main">
            <div className="fridge-contents">
            {SHELVES.map(shelf => (
                <div key={shelf.id} className="shelf">
                <div className="shelf-items">
                    {shelf.items.map(item => (
                    <Chip key={item.id} item={item} inBasket={basketIds.has(item.id)} />
                    ))}
                </div>
                <div className="shelf-bar" />
                </div>
            ))}
            <div className="drawers-row">
                {DRAWERS.map(drawer => (
                <div key={drawer.id} className="shelf drawer">
                    <div className="shelf-items">
                    {drawer.items.map(item => (
                        <Chip key={item.id} item={item} inBasket={basketIds.has(item.id)} />
                    ))}
                    </div>
                </div>
                ))}
            </div>
            </div>
            <Door
                isOpen={fridgeOpen}
                onToggle={() => setFridgeOpen(o => !o)}
                handleHeight="60px"
                trays={["Condiment 1", "Condiment 2", "Condiment 3"]}
                sceneClass="fridge-scene"
                />
        </div>

        </div>
    )
}