import Dexie from 'dexie'

export const db = new Dexie('hockeytool')
db.version(1).stores({
  players: '++id, name, number',
  games: '++id, date, opponent, teamGoals, opponentGoals',
  goals: '++id, gameId, scorerId, assist1Id, assist2Id',
  lineups: '++id, name',
  thoughts: '++id, gameId, createdAt'
})

export const defaultSlots = {
  F1:null,F2:null,F3:null,F4:null,F5:null,F6:null,F7:null,F8:null,F9:null,F10:null,F11:null,F12:null,
  D1:null,D2:null,D3:null,D4:null,D5:null,D6:null,
  PP1_1:null,PP1_2:null,PP1_3:null,PP1_4:null,PP1_5:null,
  PP2_1:null,PP2_2:null,PP2_3:null,PP2_4:null,PP2_5:null
}

export async function ensureLineup(){
  let lu = await db.lineups.where('name').equals('current').first()
  if(!lu){
    const id = await db.lineups.add({ name:'current', slots: defaultSlots })
    lu = await db.lineups.get(id)
  }
  return lu
}
