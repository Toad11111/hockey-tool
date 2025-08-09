import React, { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/db'
import { useI18n } from '../i18n'

export default function Thoughts(){
  const { t } = useI18n()
  const games = useLiveQuery(()=> db.games.toArray(), [])
  const [selectedId, setSelectedId] = useState(null)
  const [text, setText] = useState('')
  const thoughts = useLiveQuery(()=> selectedId ? db.thoughts.where('gameId').equals(selectedId).reverse().sortBy('createdAt') : Promise.resolve([]), [selectedId])

  const gameLabel = g => `${new Date(g.date).toLocaleDateString()} — ${g.teamGoals > g.opponentGoals ? 'Win' : (g.teamGoals===g.opponentGoals?'Tie':'Loss')} ${g.teamGoals}-${g.opponentGoals} vs ${g.opponent}`

  async function addThought(){
    if(!text.trim() || !selectedId) return
    await db.thoughts.add({ gameId:selectedId, text:text.trim(), createdAt:new Date().toISOString() })
    setText('')
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-6">
      <div className="card">
        <div className="title mb-2">{t('games')}</div>
        <ul className="space-y-2">
          {(games||[]).sort((a,b)=> new Date(b.date)-new Date(a.date)).map(g=>(
            <li key={g.id}>
              <button className={`btn w-full text-left ${selectedId===g.id?'bg-zinc-200 dark:bg-zinc-800':''}`} onClick={()=>setSelectedId(g.id)}>
                {gameLabel(g)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        {selectedId ? (
          <>
            <div className="card">
              <div className="title mb-2">{t('addThought')}</div>
              <textarea className="w-full rounded-md border p-2 bg-transparent min-h-[6rem]" value={text} onChange={e=>setText(e.target.value)} />
              <div className="mt-2"><button className="btn" onClick={addThought}>{t('save')}</button></div>
            </div>
            <div className="card">
              <div className="title mb-2">Forum</div>
              <div className="space-y-3">
                {(thoughts||[]).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)).map(th=>(
                  <div key={th.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
                    <div className="text-xs opacity-70">{new Date(th.createdAt).toLocaleString()}</div>
                    <div>{th.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : <div className="opacity-70">Select a game…</div>}
      </div>
    </div>
  )
}
