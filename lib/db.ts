import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let db: any = null;

async function openDb() {
  if (!db) {
    if (process.env.NODE_ENV === 'production') {
      // En producción, usa una base de datos en memoria
      db = await open({
        filename: ':memory:',
        driver: sqlite3.Database
      })
    } else {
      // En desarrollo, usa un archivo SQLite
      db = await open({
        filename: './mydb.sqlite',
        driver: sqlite3.Database
      })
    }
    await db.exec(`
      CREATE TABLE IF NOT EXISTS pins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pin TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
    
    // Si estamos en producción, añade algunos PINs por defecto
    if (process.env.NODE_ENV === 'production') {
      await db.exec(`
        INSERT OR IGNORE INTO pins (pin) VALUES ('1234'), ('5678'), ('9876')
      `)
    }
  }
  return db
}

export async function verifyPin(pin: string): Promise<boolean> {
  const db = await openDb()
  const result = await db.get('SELECT * FROM pins WHERE pin = ?', pin)
  return !!result
}

export async function addPin(pin: string): Promise<void> {
  const db = await openDb()
  await db.run('INSERT INTO pins (pin) VALUES (?)', pin)
}

export async function removePin(pin: string): Promise<void> {
  const db = await openDb()
  await db.run('DELETE FROM pins WHERE pin = ?', pin)
}

export async function listPins(): Promise<string[]> {
  const db = await openDb()
  const results = await db.all('SELECT pin FROM pins')
  return results.map((row: any) => row.pin)
}