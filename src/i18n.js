import React from 'react'

const strings = {
  fr: {
    lineup: 'Lineup',
    stats: 'Stats',
    thoughts: 'Game thoughts',
    addPlayer: 'Ajouter un joueur',
    playerList: 'Liste des joueurs',
    forwards: 'FORWARDS',
    defense: 'DEFENSE',
    powerplay: 'POWERPLAY',
    powerplay2: 'POWERPLAY 2',
    name: 'Nom',
    age: 'Âge',
    number: 'Numéro',
    shoots: 'Main de tir',
    left: 'Gauche',
    right: 'Droite',
    optional: 'Optionnel',
    save: 'Enregistrer',
    cancel: 'Annuler',
    addGame: 'Ajouter un match',
    opponent: 'Adversaire',
    date: 'Date',
    teamGoals: 'Buts de l\'équipe',
    opponentGoals: 'Buts de l\'adversaire',
    scorer: 'Buteur',
    assist1: 'Passe 1 (opt)',
    assist2: 'Passe 2 (opt)',
    table: 'Tableau des joueurs',
    goals: 'Buts',
    assists: 'Passes',
    points: 'Points',
    last5: '5 derniers matchs',
    onFire: 'On Fire (points sur 4 derniers matchs)',
    games: 'Matchs',
    addThought: 'Ajouter une observation',
    export: 'Exporter',
    import: 'Importer'
  },
  en: {
    lineup: 'Lineup',
    stats: 'Stats',
    thoughts: 'Game thoughts',
    addPlayer: 'Add player',
    playerList: 'Player list',
    forwards: 'FORWARDS',
    defense: 'DEFENSE',
    powerplay: 'POWERPLAY',
    powerplay2: 'POWERPLAY 2',
    name: 'Name',
    age: 'Age',
    number: 'Number',
    shoots: 'Shoots',
    left: 'Left',
    right: 'Right',
    optional: 'Optional',
    save: 'Save',
    cancel: 'Cancel',
    addGame: 'Add a game',
    opponent: 'Opponent',
    date: 'Date',
    teamGoals: 'Team goals',
    opponentGoals: 'Opponent goals',
    scorer: 'Scorer',
    assist1: 'Assist 1 (opt)',
    assist2: 'Assist 2 (opt)',
    table: 'Players table',
    goals: 'Goals',
    assists: 'Assists',
    points: 'Points',
    last5: 'Last 5 games',
    onFire: 'On Fire (points over last 4 games)',
    games: 'Games',
    addThought: 'Add thought',
    export: 'Export',
    import: 'Import'
  }
}

const I18nContext = React.createContext()

export function I18nProvider({children}){
  const [lang, setLang] = React.useState(()=>localStorage.getItem('lang')||'fr')
  const toggleLang = ()=>{
    const next = lang === 'fr' ? 'en' : 'fr'
    setLang(next)
    localStorage.setItem('lang', next)
  }
  const t = (k)=> strings[lang][k] || k
  return <I18nContext.Provider value={{t, lang, toggleLang}}>{children}</I18nContext.Provider>
}

export function useI18n(){
  return React.useContext(I18nContext)
}
