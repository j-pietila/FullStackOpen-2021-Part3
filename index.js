require("dotenv").config()
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()

const Person = require("./models/person")

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
  Person
    .find({})
    .then(person => {
      response.json(person)
    })
    .catch(error => {
      console.log("Error:", error.message)
    })
})

app.get("/api/persons/:id", (request, response) => {
  Person
  .findById(request.params.id)
  .then(person => {
    response.json(person)
  })
  .catch(error => {
    console.log("Error:", error.message)
    response.status(404).end()
  })
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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
