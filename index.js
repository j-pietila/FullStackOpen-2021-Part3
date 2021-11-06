const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

app.use(express.json())
app.use(express.static("build"))
app.use(cors())

morgan.token("response-data", (req, res) => {
  if (Object.keys(res.req.body).length !== 0) {
    return JSON.stringify(res.req.body)
  }
  return " "
})

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :response-data"))

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get("/api/info", (request, response) => {
  const people = persons.length
  const info = `Phonebook has info of ${people} people`
  const date = new Date()

  response.send(
    `<p>${info}</p>
     <p>${date}</p>`
  )
})

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: "number missing"
    })
  }
  else if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: "name already in phonebook"
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
