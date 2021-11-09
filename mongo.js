const mongoose = require("mongoose")

// Program usage:
// node mongo.js yourpassword: Prints all the phone numbers from the database
// node mongo.js yourpassword "Arto Vihavainen" 040-1234556: Adds new person to phonebook

if (process.argv.length < 3 ||
	 (process.argv.length > 3 && process.argv.length < 5) ||
	 (process.argv.length > 5)) {
		console.log("Wrong number of arguments. Check code file for proper program usage.")
		process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://db_access:${password}@testcluster.5my5d.mongodb.net/phonebook?retryWrites=true`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
})

const Person = mongoose.model("Person", personSchema)

const getPersons = () => {
	console.log("Phonebook:")

	Person
		.find({})
		.then(result => {
			result.forEach(person => {
			console.log(`${person.name} ${person.number}`)
		})
		mongoose.connection.close()
	})
}

const addPerson = () => {
	const newName = process.argv[3]
	const newNumber = process.argv[4]
	
	const person = new Person({
		name: newName,
		number: newNumber,
	})

	person
		.save()
		.then(response => {
			console.log(`Added ${newName} number ${newNumber} to phonebook`)
			mongoose.connection.close()
		})
}

if (process.argv.length === 3) { // Only password as a parameter
	getPersons()
}
else if (process.argv.length === 5) { // Password, name and number as parameters
	addPerson()
}
