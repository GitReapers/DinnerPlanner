import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Chip({ item, inBasket, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: item,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : inBasket ? 0.4 : 1,
    pointerEvents: inBasket ? 'none' : undefined,
  }

  return (
    <div ref={setNodeRef} style={style} className="ingredient-chip" {...listeners} {...attributes}>
      <span style={{ fontSize: 14 }}>{item.emoji}</span>
      {item.name}
      <span
        className="chip-delete"
        onPointerDown={e => e.stopPropagation()}
        onClick={e => { e.stopPropagation(); onDelete(item.id) }}
      >×</span>
    </div>
  )
}

function ShelfZone({ zoneId, items, inBasket, className, children, onDelete }) {
  const { setNodeRef } = useDroppable({ id: zoneId })
  return (
    <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
      <div className={className} ref={setNodeRef}>
        {children}
        <div className="shelf-items">
          {items.map(item => (
            <Chip key={item.id} item={item} inBasket={inBasket.has(item.id)} onDelete={onDelete} />
          ))}
        </div>
      </div>
    </SortableContext>
  )
}

function Door({ isOpen, onToggle, handleHeight, trayZones, shelves, inBasket, sceneClass, onDelete }) {
  return (
    <div className={`door-scene ${sceneClass}`}>
      <div className={`door ${isOpen ? 'open' : ''}`} onClick={onToggle}>
        <div className="door-front">
          <div className="door-handle" style={{ height: handleHeight }} />
          <div className="door-hint">click to open</div>
        </div>
        <div className="door-back">
          {trayZones.map(({ zoneId }) => (
            <SortableContext key={zoneId} items={(shelves[zoneId] || []).map(i => i.id)} strategy={rectSortingStrategy}>
              <div className="door-tray">
                <div className="shelf-items">
                  {(shelves[zoneId] || []).map(item => (
                    <Chip key={item.id} item={item} inBasket={inBasket.has(item.id)} onDelete={onDelete} />
                  ))}
                </div>
              </div>
            </SortableContext>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Fridge({ basket, shelves, onDelete }) {
  const [freezerOpen, setFreezerOpen] = useState(false)
  const [fridgeOpen, setFridgeOpen] = useState(false)
  const basketIds = new Set(basket.map(b => b.id))

  return (
    <div className="fridge">

      <div className="fridge-section freezer">
        <div className="fridge-contents">
          <ShelfZone zoneId="freezer" items={shelves.freezer} inBasket={basketIds} className="shelf" onDelete={onDelete}>
            <div className="shelf-bar" />
          </ShelfZone>
        </div>
        <Door
          isOpen={freezerOpen}
          onToggle={() => setFreezerOpen(o => !o)}
          handleHeight="30px"
          trayZones={[{ zoneId: 'freezer_tray' }]}
          shelves={shelves}
          inBasket={basketIds}
          sceneClass="freezer-scene"
          onDelete={onDelete}
        />
      </div>

      <div className="fridge-section main">
        <div className="fridge-contents">
          {['top', 'low'].map(id => (
            <ShelfZone key={id} zoneId={id} items={shelves[id]} inBasket={basketIds} className="shelf" onDelete={onDelete}>
              <div className="shelf-bar" />
            </ShelfZone>
          ))}
          <div className="drawers-row">
            {['fruit', 'produce'].map(id => (
              <ShelfZone key={id} zoneId={id} items={shelves[id]} inBasket={basketIds} className="shelf drawer" onDelete={onDelete} />
            ))}
          </div>
        </div>
        <Door
          isOpen={fridgeOpen}
          onToggle={() => setFridgeOpen(o => !o)}
          handleHeight="60px"
          trayZones={[
            { zoneId: 'tray_condiments' },
            { zoneId: 'tray_drinks' },
            { zoneId: 'tray_eggs' },
          ]}
          shelves={shelves}
          inBasket={basketIds}
          sceneClass="fridge-scene"
          onDelete={onDelete}
        />
      </div>

    </div>
  )
}