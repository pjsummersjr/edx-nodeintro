const mongoose = require('mongoose')
const config = require('./config.js')

mongoose.connect(config.databaseUrl)

let Book = mongoose.model('Book', {name: String})

let practicalNodeBook = new Book({name: 'Practical NodeJs'})
practicalNodeBook.save((err, result) => {
    if(err) {
        console.error(`Error occurred: ${err}`)
        process.exit(1)
    }
    else {
        console.log(`Book saved: ${result}`)
        process.exit(0)
    }
})