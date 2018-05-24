const mongoose = require('mongoose')

let Account = mongoose.model('Account', {
    name: String,
    balance: Number
}) 

module.exports = Account
