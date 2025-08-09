import React, { useEffect, useMemo, useState } from 'react'
import PlayerForm from '../components/PlayerForm'
import PlayerList, { PlayerPill } from '../components/PlayerList'
import { DndContext, useDroppable } from '@dnd-kit/core'
import { db, ensureLineup } from '../store/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useI18n } from '../i18n'

function Slot({id, player}){
  const {isOver, setNodeRef} = useDroppable({ id })
  return (
    <div ref={setNodeRef} className={`slot ${isOver? 'bg-zinc-200/50 dark:bg-zinc-700/40':''}`}>
      {player && <PlayerPill player={player} draggableId={`slot-${id}`} />}
    </div>
  )
}

export default function Lineup(){
  const { t } = useI18n()
  const players = useLiveQuery(()=> db.players.toArray(), [])
  const [lineup, setLineup] = useState(null)
  const playerMap = useMemo(()=>{
    const m = {}
    ;(players||[]).forEach(p=> m[p.id]=p)
    return m
  }, [players])

  useEffect(()=>{ (async()=> setLineup(await ensureLineup()))() }, [])

  const occupiedIds = useMemo(()=>{
    const s = new Set()
    if(lineup?.slots) Object.values(lineup.slots).forEach(v=>{ if(v) s.add(v) })
    return s
  }, [lineup])

  async function updateSlots(slots){
    const updated = {...lineup, slots}
    await db.lineups.update(lineup.id, {slots})
    setLineup(updated)
  }

  async function handleDragEnd(event){
    if(!lineup) return
    const { active, over } = event
    if(!over) return
    const slots = { ...lineup.slots }
    const overId = over.id
    let draggedPlayerId = null
    let fromSlotId = null

    if(active.id.startsWith('player-')){
      draggedPlayerId = Number(active.id.split('-')[1])
    } else if(active.id.startsWith('slot-')){
      fromSlotId = active.id.split('-')[1]
      draggedPlayerId = slots[fromSlotId]
      if(!draggedPlayerId) return
    } else {
      return
    }

    slots[overId] = draggedPlayerId
    if(fromSlotId && fromSlotId !== overId){
      slots[fromSlotId] = null
    }
    await updateSlots(slots)
  }

  if(!lineup) return <div>Loading…</div>

  const section = (title, ids) => (
    <div className="mb-6">
      <div className="font-bold mb-2">{title}</div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {ids.map(id => <Slot key={id} id={id} player={playerMap[lineup.slots[id]]} />)}
      </div>
    </div>
  )

  const fIds = Array.from({length:12}, (_,i)=>`F${i+1}`)
  const dIds = Array.from({length:6}, (_,i)=>`D${i+1}`)
  const pp1 = Array.from({length:5}, (_,i)=>`PP1_${i+1}`)
  const pp2 = Array.from({length:5}, (_,i)=>`PP2_${i+1}`)

  return (
    <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
      <div className="flex flex-col gap-4">
        <PlayerForm />
        <PlayerList occupiedIds={occupiedIds} />
      </div>
      <DndContext onDragEnd={handleDragEnd}>
        <div>
          <div className="text-center font-black tracking-wide">{t('forwards')}</div>
          {section('', fIds)}
          <div className="text-center font-black tracking-wide">{t('defense')}</div>
          {section('', dIds)}
          <div className="text-center font-black tracking-wide">{t('powerplay')}</div>
          {section('', pp1)}
          <div className="text-center font-black tracking-wide">{t('powerplay2')}</div>
          {section('', pp2)}
        </div>
      </DndContext>
    </div>
  )
}
