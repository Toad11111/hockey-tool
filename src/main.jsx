import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Home from './pages/Home'
import Lineup from './pages/Lineup'
import Stats from './pages/Stats'
import Thoughts from './pages/Thoughts'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="lineup" element={<Lineup />} />
          <Route path="stats" element={<Stats />} />
          <Route path="thoughts" element={<Thoughts />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)
