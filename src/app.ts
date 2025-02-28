import express from 'express';
import { validate } from "class-validator"
import { plainToInstance} from "class-transformer";
import { v4 as uuidv4 } from 'uuid';

import pool from "./database"
import { CreateNote, UpdateNote } from "./validation"

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    res.send({message: 'Healthcheck'});
})

app.post("/notes", async (req, res) => {
    const note = plainToInstance(CreateNote, req.body)
    const errors = await validate(note, {skipMissingProperties: true})
    if (errors.length > 0) {

        let errorTexts: any[] = [];
        for (const errorItem of errors) {
            errorTexts = errorTexts.concat(errorItem.constraints);
        }
        res.status(400).send(errorTexts)
        return
    }
    const id = uuidv4()
    const now = new Date().toISOString()
    const q = `
    INSERT INTO note(id, title, description, createdAt, updatedAt)
    VALUES($1, $2, $3, $4, $4)
    RETURNING *
    `
    try {
        const results = await pool.query(q, [id, note.title, note.description, now])
        res.send(results.rows[0])
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.get("/notes", async (req, res) => {
    const q = `
    SELECT id, title, description, createdAt, updatedAt
    FROM note
    `
    try {
        const results = await pool.query(q)
        const notes = results.rows
        res.send(notes)
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.get("/notes/:id", async (req, res) => {
    const q = `
    SELECT id, title, description, createdAt, updatedAt
    FROM note
    WHERE id = $1
    `
    try {
        const results = await pool.query(q, [req.params.id])
        if (results.rows.length === 0) {
            res.status(404).send("Not Found")
        }
        res.send(results.rows[0])
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.put("/notes/:id", async (req, res) => {
    const note = plainToInstance(UpdateNote, req.body)
    const errors = await validate(note, {skipMissingProperties: true})
    if (errors.length > 0) {
        let errorTexts: any[] = [];
        for (const errorItem of errors) {
            errorTexts = errorTexts.concat(errorItem.constraints);
        }
        res.status(400).send(errorTexts)
        return
    }
    const now = new Date().toISOString()
    const q = `
    UPDATE note
    SET title=$1, description=$2, updatedAt=$3
    WHERE id = $4
    RETURNING *
    `
    try {
        const results = await pool.query(q, [note.title, note.description, now, req.params.id])
        if (results.rows.length === 0) {
            res.status(404).send("Not Found")
            return
        }
        res.send(results.rows[0])
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

app.delete("/notes/:id", async (req, res) => {
    const q = `DELETE FROM note WHERE id = $1 RETURNING *`
    try {
        const results = await pool.query(q, [req.params.id])
        if (results.rows.length === 0) {
            res.status(404).send("Not Found")
        }
        res.send(results.rows[0])
    }
    catch (error){
        console.log(error)
        res.status(500).send("Internal Server Error")
    }
})

export default app