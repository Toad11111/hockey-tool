import React from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/db'
import { useI18n } from '../i18n'
import { useDraggable } from '@dnd-kit/core'

export function PlayerPill({player, draggableId}){
  const {attributes, listeners, setNodeRef, transform} = useDraggable({id: draggableId})
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="player-pill">
      #{player.number||'—'} {player.name}
    </div>
  )
}

export default function PlayerList({occupiedIds}){
  const players = useLiveQuery(()=> db.players.toArray(), [])
  const { t } = useI18n()
  const visible = (players||[]).filter(p=> !occupiedIds.has(p.id))
  return (
    <div className="card w-64 h-[32rem] overflow-y-auto scroll-thin">
      <div className="font-bold mb-2">{t('playerList')}</div>
      <div className="grid gap-2">
        {visible.map(p=> <PlayerPill key={p.id} player={p} draggableId={`player-${p.id}`} />)}
      </div>
    </div>
  )
}
