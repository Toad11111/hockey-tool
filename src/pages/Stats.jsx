import React, { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/db'
import { useI18n } from '../i18n'

function AddGame({onDone}){
  const { t } = useI18n()
  const players = useLiveQuery(()=> db.players.toArray(), [])
  const [opponent,setOpponent]=useState('')
  const [date,setDate]=useState(()=> new Date().toISOString().slice(0,10))
  const [teamGoals,setTeamGoals]=useState(0)
  const [opponentGoals,setOpponentGoals]=useState(0)
  const [goals,setGoals]=useState([])

  function ensureGoals(n){
    const copy = goals.slice()
    while(copy.length < n) copy.push({scorerId:'',a1:'',a2:''})
    if(copy.length > n) copy.length = n
    setGoals(copy)
  }

  async function save(){
    const tg = Number(teamGoals)||0, og = Number(opponentGoals)||0
    const gameId = await db.games.add({ opponent, date, teamGoals: tg, opponentGoals: og })
    for(const g of goals.slice(0,tg)){
      const scorerId = Number(g.scorerId)||null
      const assist1Id = g.a1 ? Number(g.a1) : null
      const assist2Id = g.a2 ? Number(g.a2) : null
      if(scorerId) await db.goals.add({ gameId, scorerId, assist1Id, assist2Id })
    }
    onDone && onDone()
    setOpponent(''); setTeamGoals(0); setOpponentGoals(0); setGoals([])
  }

  return (
    <div className="card max-w-2xl">
      <div className="title mb-2">{t('addGame')}</div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-sm">{t('opponent')}
          <input className="w-full rounded-md border p-2 bg-transparent" value={opponent} onChange={e=>setOpponent(e.target.value)} />
        </label>
        <label className="text-sm">{t('date')}
          <input type="date" className="w-full rounded-md border p-2 bg-transparent" value={date} onChange={e=>setDate(e.target.value)} />
        </label>
        <label className="text-sm">{t('teamGoals')}
          <input type="number" min="0" className="w-full rounded-md border p-2 bg-transparent" value={teamGoals} onChange={e=>{setTeamGoals(e.target.value); ensureGoals(Number(e.target.value)||0)}} />
        </label>
        <label className="text-sm">{t('opponentGoals')}
          <input type="number" min="0" className="w-full rounded-md border p-2 bg-transparent" value={opponentGoals} onChange={e=>setOpponentGoals(e.target.value)} />
        </label>
      </div>
      <div className="mt-4 grid gap-3">
        {goals.slice(0, Number(teamGoals)||0).map((g,idx)=>(
          <div key={idx} className="grid grid-cols-3 gap-2">
            <label className="text-sm">{t('scorer')}
              <select className="w-full rounded-md border p-2 bg-transparent" value={g.scorerId} onChange={e=>{
                const copy=[...goals]; copy[idx]={...g,scorerId:e.target.value}; setGoals(copy)
              }}>
                <option value=""></option>
                {(players||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="text-sm">{t('assist1')}
              <select className="w-full rounded-md border p-2 bg-transparent" value={g.a1||''} onChange={e=>{
                const copy=[...goals]; copy[idx]={...g,a1:e.target.value}; setGoals(copy)
              }}>
                <option value=""></option>
                {(players||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
            <label className="text-sm">{t('assist2')}
              <select className="w-full rounded-md border p-2 bg-transparent" value={g.a2||''} onChange={e=>{
                const copy=[...goals]; copy[idx]={...g,a2:e.target.value}; setGoals(copy)
              }}>
                <option value=""></option>
                {(players||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </label>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button className="btn" onClick={save}>{t('save')}</button>
      </div>
    </div>
  )
}

export default function Stats(){
  const { t } = useI18n()
  const players = useLiveQuery(()=> db.players.toArray(), [])
  const games = useLiveQuery(()=> db.games.toArray(), [])
  const goals = useLiveQuery(()=> db.goals.toArray(), [])

  const totals = useMemo(()=>{
    const map = {}
    ;(players||[]).forEach(p=> map[p.id] = { goals:0, assists:0, points:0, player:p })
    ;(goals||[]).forEach(g=>{
      if(map[g.scorerId]){ map[g.scorerId].goals++; map[g.scorerId].points++ }
      if(g.assist1Id && map[g.assist1Id]){ map[g.assist1Id].assists++; map[g.assist1Id].points++ }
      if(g.assist2Id && map[g.assist2Id]){ map[g.assist2Id].assists++; map[g.assist2Id].points++ }
    })
    return Object.values(map).sort((a,b)=> b.points - a.points)
  }, [players, goals])

  const last5 = useMemo(()=>{
    const sorted = (games||[]).slice().sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,5)
    return sorted.map(g=> ({
      ...g,
      label: `${new Date(g.date).toLocaleDateString()} — ${g.teamGoals > g.opponentGoals ? 'Win' : (g.teamGoals===g.opponentGoals?'Tie':'Loss')} ${g.teamGoals}-${g.opponentGoals} vs ${g.opponent}`
    }))
  }, [games])

  const onFire = useMemo(()=>{
    const sorted = (games||[]).slice().sort((a,b)=> new Date(b.date)-new Date(a.date)).slice(0,4)
    const ids = new Set(sorted.map(g=> g.id))
    const map = {}
    ;(players||[]).forEach(p=> map[p.id] = 0)
    ;(goals||[]).forEach(g=>{
      if(ids.has(g.gameId)){
        map[g.scorerId] = (map[g.scorerId]||0) + 1
        if(g.assist1Id) map[g.assist1Id] = (map[g.assist1Id]||0) + 1
        if(g.assist2Id) map[g.assist2Id] = (map[g.assist2Id]||0) + 1
      }
    })
    let bestId=null, best= -1
    for(const [pid,pts] of Object.entries(map)){
      if(pts>best){ best=pts; bestId=Number(pid) }
    }
    const p = (players||[]).find(p=>p.id===bestId)
    return p ? {player:p, points:best} : null
  }, [games, goals, players])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_16rem] gap-6">
      <div className="flex flex-col gap-4">
        <AddGame />
        <div className="card">
          <div className="title mb-2">{t('table')}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="py-1 pr-2">{t('name')}</th>
                  <th className="py-1 pr-2">{t('goals')}</th>
                  <th className="py-1 pr-2">{t('assists')}</th>
                  <th className="py-1 pr-2">{t('points')}</th>
                </tr>
              </thead>
              <tbody>
                {totals.map(r=> (
                  <tr key={r.player.id} className="border-b border-zinc-200 dark:border-zinc-800">
                    <td className="py-1 pr-2">#{r.player.number||'—'} {r.player.name}</td>
                    <td className="py-1 pr-2">{r.goals}</td>
                    <td className="py-1 pr-2">{r.assists}</td>
                    <td className="py-1 pr-2 font-semibold">{r.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="card">
          <div className="title mb-2">{t('onFire')}</div>
          {onFire ? (<div>#{onFire.player.number||'—'} {onFire.player.name} — {onFire.points} {t('points').toLowerCase()}</div>) : (<div>—</div>)}
        </div>
        <div className="card">
          <div className="title mb-2">{t('last5')}</div>
          <ul className="list-disc pl-5">
            {last5.map(g=> <li key={g.id}>{g.label}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
