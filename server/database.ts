import path from "path" // safely builds file paths (works on Windows, Linux, Docker)
import fs from "node:fs/promises" // lets us read/write files using async/await


const DB_PATH = path.resolve(process.cwd(), "database.json");


export type DbShape = {
    users: Array<{ 
        id: number,
        github: string,
    }>
}


//  Promise<DbShape> This function will eventually give you a DbShape
export async function readDb(): Promise<DbShape> {
    const raw = await fs.readFile(DB_PATH, "utf-8")
    return JSON.parse(raw) as DbShape
}
  
// promise<void> means nothing will be returned
export async function writeDb(db: DbShape): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8") // null -> no custom replacer, 2 -> indent with 2 spaces
}
  
  // Finds the highest id number then adds 1
export function nextId(items: Array<{ id: number }>): number {
    return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
}
