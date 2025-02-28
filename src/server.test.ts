import request from "supertest"
import app from "./app"

describe("Healthcheck", () => {
    test("test healthcheck", async () => {
        const res = await request(app).get("/")
        expect(res.status).toBe(200)
        expect(res.body).toEqual({message: 'Healthcheck'})
    })
})

describe("Create Note", () => {
    test("Create a valid note", async () => {
        const body = {"title": "Note", "description": "This is a note"}
        const res = await request(app).post("/notes").send(body)
        expect(res.status).toBe(200)
        expect(res.body.title).toBe("Note")
        expect(res.body.description).toBe("This is a note")
    })
    test("Create an invalid note", async () => {
        const body = {"not_title": "Note", "not_description": "This is a note"}
        const res = await request(app).post("/notes").send(body)
        expect(res.status).toBe(400)
    })
})

describe("List Notes", () => {
    test("Create note and ensure it appears in list", async () => {
        const body = {"title": "Note", "description": "This is a note"}
        const res1 = await request(app).post("/notes").send(body)
        const id = res1.body.id
        const res2 = await request(app).get("/notes")
        expect(res2.status).toBe(200)
        const note = res2.body.find((note: { id: string }) => note.id = id)
        expect(note).not.toBeNull()
    })
})

describe("Get Note", () => {
    test("Create note and try to get it", async () => {
        const body = {"title": "Note", "description": "This is a note"}
        const res1 = await request(app).post("/notes").send(body)
        const id = res1.body.id
        const res2 = await request(app).get("/notes/" + id)
        expect(res2.status).toBe(200)
        expect(res2.body.id).toBe(id)
        expect(res2.body.title).toBe("Note")
        expect(res2.body.description).toBe("This is a note")
    })

    test("Try to get a note with a non-existent id", async () => {
        const res = await request(app).get("/notes/123456789")
        expect(res.status).toBe(404)
        expect(res.text).toBe("Not Found")
    })
})

describe("Update Note", () => {
    let id = ""
    beforeEach(async () => {
        const body = {"title": "Note", "description": "This is a note"}
        const res = await request(app).post("/notes").send(body)
        id = res.body.id
    })
    test("Update note", async () => {
        const body = {"title": "Note 2", "description": "This is another note"}
        const res = await request(app).put("/notes/" + id).send(body)
        expect(res.status).toBe(200)
        expect(res.body.id).toBe(id)
        expect(res.body.title).toBe("Note 2")
        expect(res.body.description).toBe("This is another note")
    })
    test("Update note with invalid body", async () => {
        const body = {"not_title": "Bad note", "not_description": "This is a bad note"}
        const res = await request(app).put("/notes/" + id).send(body)
        expect(res.status).toBe(400)
    })
    test("Update non-existent note", async () => {
        const body = {"title": "Note 2", "description": "This is another note"}
        const res = await request(app).put("/notes/123456789").send(body)
        expect(res.status).toBe(404)
        expect(res.text).toBe("Not Found")
    })
})

describe("Delete Note", () => {
    test("Create note and try to delete it", async () => {
        const body = {"title": "Note", "description": "This is a note"}
        const res1 = await request(app).post("/notes").send(body)
        const id = res1.body.id
        const res2 = await request(app).delete("/notes/" + id)
        expect(res2.status).toBe(200)
        expect(res2.body.id).toBe(id)
        const res3 = await request(app).get("/notes/" + id)
        expect(res3.status).toBe(404)
    })

    test("Try to delete a note with a non-existent id", async () => {
        const res = await request(app).delete("/notes/123456789")
        expect(res.status).toBe(404)
        expect(res.text).toBe("Not Found")
    })
})
