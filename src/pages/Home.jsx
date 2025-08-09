import React from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function Home(){
  const { t } = useI18n()
  const Btn = ({to, children}) => (
    <Link to={to} className="block w-full max-w-md mx-auto my-6">
      <div className="card text-center text-2xl font-bold py-8">{children}</div>
    </Link>
  )
  return (
    <div className="text-center mt-16">
      <h1 className="text-6xl font-extrabold mb-2">HOCKEY</h1>
      <h2 className="text-6xl font-extrabold mb-10">TOOL</h2>
      <Btn to="/lineup">{t('lineup')}</Btn>
      <Btn to="/stats">{t('stats')}</Btn>
      <Btn to="/thoughts">{t('thoughts')}</Btn>
    </div>
  )
}
