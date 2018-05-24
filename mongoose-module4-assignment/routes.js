const express = require('express')
var router = express.Router()

router.use((req, res, next) => {
    //Router middleware. Does nothing right now but want to captuer the syntax
    console.log(`${req.method}: ${req.url}`)
    next()
})

router.get('/', (req, res) => {
    res.status(200).send({data: 'Data is gooood'})
})

router.get('/accounts', (req, res) => {
    res.status(200).send({accounts:[{
        name: 'Microsoft',
        balance: 1000000000000
    }]})
})

module.exports = router