import express from "express"
import * as rowdy from "rowdy-logger"
import variables from '../globalVariables.ts'
import {readDb, writeDb, nextId} from "./database.ts"


const port = variables.PORT
const app = express()
app.use(express.json())
const routesReport = rowdy.begin(app)

// this acts as a middleware is called before the main api is called
app.use((req, _res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
});

// GET all users
app.get("/api/users", async (_req, res) => {
    const db = await readDb()
    res.json(db.users)
})
  
// GET one user
app.get("/api/users/:id", async (req, res) => {
    const id = Number(req.params.id)
    const db = await readDb()
    const user = db.users.find(u => u.id === id)
    if (!user) return res.status(404).json({ error: "User not found" })
    res.json(user)
})
  
// CREATE user
app.post("/api/users", async (req, res) => {
    const {name, email, password} = req.body
    if (!name) return res.status(400).json({ error: "name is required" })
  
    const db = await readDb()
    const user = { id: nextId(db.users), name, email, password }
    db.users.push(user)
  
    await writeDb(db)
    res.status(201).json(user)
})
  
// UPDATE user
app.put("/api/users/:id", async (req, res) => {
    const id = Number(req.params.id)
    const name = String(req.body?.name ?? "").trim()
    if (!name) return res.status(400).json({ error: "name is required" })
  
    const db = await readDb()
    const user = db.users.find(u => u.id === id)
    if (!user) return res.status(404).json({ error: "User not found" })
  
    user.name = name
    await writeDb(db)
    res.json(user)
})
  
// DELETE user
app.delete("/api/users/:id", async (req, res) => {
    const id = Number(req.params.id)
    const db = await readDb()
  
    const before = db.users.length
    db.users = db.users.filter(u => u.id !== id)
    if (db.users.length === before) return res.status(404).json({ error: "User not found" })
  
    await writeDb(db)
    res.status(204).send()
})

app.listen(port, ()=> {
    console.log(`server is running on PORT: ${port}`)
    routesReport.print()
})