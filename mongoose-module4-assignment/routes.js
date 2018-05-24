const express = require('express')
const mongoose = require('mongoose')
const config = require('./config.js')
const Account = require('./models.js')
var router = express.Router()

mongoose.connect(config.databaseUrl)

router.use((req, res, next) => {
    //Router middleware. Does nothing right now but want to captuer the syntax
    console.log(`${req.method}: ${req.url}`)
    next()
})

router.get('/', (req, res) => {

    res.status(200).send({data: 'Data is gooood'})
})

router.get('/accounts', (req, res) => {
    Account.find((err, result) => {
        if(err) res.sendStatus(500)
        else {
            res.status(200).send(result)
        }
    })
})

router.post('/accounts', (req, res) => {
    let account = new Account(req.body)
    account.save((err, result) => {

        if(err) res.sendStatus(500)
        
        res.status(200).send({
            result
        })
    })
})

router.put('/accounts/:id', (req, res) =>{
    if(req.params.id) {
        Account.findOneAndUpdate({_id: req.params.id}, req.body, (err, result) => {
            if(err) res.status(500).send(err)
            else {
                res.status(200).send(result)
            }
        })
    }
})

router.delete('/accounts/:id', (req, res) => {
    if(req.params.id) {
        Account.remove({_id: req.params.id}, (err, result) => {
            if(err) res.status(500).send(err)
            else {
                res.status(200).send(result)
            }
        })
    }
    else {
        req.status(404).send('Invalid request')
    }
})

module.exports = router