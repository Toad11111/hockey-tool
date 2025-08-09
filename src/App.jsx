import React, { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { I18nProvider, useI18n } from './i18n'

function Shell(){
  const { t, lang, toggleLang } = useI18n()
  const [dark, setDark] = useState(() => localStorage.getItem('dark') === '1')
  const location = useLocation()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('dark', dark ? '1' : '0')
  }, [dark])

  return (
    <div className="min-h-screen">
      <header className="border-b border-zinc-200 dark:border-zinc-800 sticky top-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="font-extrabold text-xl">HOCKEY TOOL</Link>
          <nav className="ml-auto flex gap-2">
            <Link className={`btn ${location.pathname==='/lineup'?'bg-zinc-200 dark:bg-zinc-800':''}`} to="/lineup">{t('lineup')}</Link>
            <Link className={`btn ${location.pathname==='/stats'?'bg-zinc-200 dark:bg-zinc-800':''}`} to="/stats">{t('stats')}</Link>
            <Link className={`btn ${location.pathname==='/thoughts'?'bg-zinc-200 dark:bg-zinc-800':''}`} to="/thoughts">{t('thoughts')}</Link>
            <button className="btn" onClick={toggleLang}>{lang.toUpperCase()}</button>
            <button className="btn" onClick={()=>setDark(d=>!d)}>{dark ? '☾' : '☀'}</button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

export default function App(){
  return (
    <I18nProvider>
      <Shell />
    </I18nProvider>
  )
}
