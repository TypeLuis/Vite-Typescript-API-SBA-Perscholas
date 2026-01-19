import express from "express"
import * as rowdy from "rowdy-logger"
import variables from '../globalVariables.ts'
import {readDb, writeDb, nextId} from "./database.ts"


const port = variables.PORT
const app = express()
app.use(express.json())
const routesReport = rowdy.begin(app)

// this acts as a middleware is called before the main api is called
// _res we're using the parameter but not calling it so the "_" impicitly states that
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
    try {
        const id = Number(req.params.id)
        const db = await readDb()
        const user = db.users.find(u => u.id === id)
        if (!user) return res.status(404).json({ error: "User not found" })
        res.json(user)
    } catch (err) {
        if(err instanceof Error) res.status(500).json({ error: err.message })
        else  res.status(500).json({ error: "Unknown error occurred" })
    }
})
  
// CREATE user
app.post("/api/users", async (req, res) => {
    try {
        const {github} = req.body
        if (!github) return res.status(400).json({ error: "name is required" })
      
        const db = await readDb()
        const user = { id: nextId(db.users), github }
        db.users.push(user)
      
        await writeDb(db)
        res.status(201).json(user)
    } catch (error) {
        if(error instanceof Error) res.status(500).json({ error: error.message })
        else  res.status(500).json({ error: "Unknown error occurred" })
    }
})
  
// UPDATE user
app.put("/api/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const github = String(req.body?.github ?? "").trim()
        if (!github) return res.status(400).json({ error: "name is required" })
      
        const db = await readDb()
        const user = db.users.find(u => u.id === id)
        if (!user) return res.status(404).json({ error: "User not found" })
      
        user.github = github
        await writeDb(db)
        res.json(user)
    } catch (error) {
        if(error instanceof Error) res.status(500).json({ error: error.message })
        else  res.status(500).json({ error: "Unknown error occurred" })
    }
})
  
// DELETE user
app.delete("/api/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id)
        const db = await readDb()
      
        const before = db.users.length
        db.users = db.users.filter(u => u.id !== id)
        if (db.users.length === before) return res.status(404).json({ error: "User not found" })
      
        await writeDb(db)
        res.status(204).send().json()
    } catch (error) {
        if(error instanceof Error) res.status(500).json({ error: error.message })
        else  res.status(500).json({ error: "Unknown error occurred" })
    }
})

app.listen(port, ()=> {
    console.log(`server is running on PORT: ${port}`)
    routesReport.print()
})