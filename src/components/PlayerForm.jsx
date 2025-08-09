import React, { useState } from 'react'
import { db } from '../store/db'
import { useI18n } from '../i18n'

export default function PlayerForm({onDone}){
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [number, setNumber] = useState('')
  const [shoots, setShoots] = useState('')

  async function submit(e){
    e.preventDefault()
    if(!name.trim()) return
    await db.players.add({ name: name.trim(), age: age? Number(age): null, number: number? Number(number): null, shoots: shoots||null })
    setName(''); setAge(''); setNumber(''); setShoots('')
    onDone && onDone()
  }

  return (
    <form onSubmit={submit} className="card flex flex-col gap-2 max-w-md">
      <div className="title">{t('addPlayer')}</div>
      <label className="text-sm">{t('name')}
        <input className="w-full rounded-md border p-2 bg-transparent" value={name} onChange={e=>setName(e.target.value)} required />
      </label>
      <label className="text-sm">{t('age')} ({t('optional')})
        <input type="number" className="w-full rounded-md border p-2 bg-transparent" value={age} onChange={e=>setAge(e.target.value)} />
      </label>
      <label className="text-sm">{t('number')} ({t('optional')})
        <input type="number" className="w-full rounded-md border p-2 bg-transparent" value={number} onChange={e=>setNumber(e.target.value)} />
      </label>
      <label className="text-sm">{t('shoots')} ({t('optional')})
        <select className="w-full rounded-md border p-2 bg-transparent" value={shoots} onChange={e=>setShoots(e.target.value)}>
          <option value="">—</option>
          <option value="L">{t('left')}</option>
          <option value="R">{t('right')}</option>
        </select>
      </label>
      <button className="btn self-start" type="submit">{t('save')}</button>
    </form>
  )
}
