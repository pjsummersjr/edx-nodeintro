const express = require('express')
const expressConfig = require('./config/express-config.js')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorHandler')

const app = express()


app.set('port', expressConfig.PORT)
app.set('views', expressConfig.VIEW_ENGINE)
app.set('view engine', expressConfig.VIEW_ENGINE)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(errorHandler())
app.use(logger('dev'))

console.log('Initializing data stores')
let store = {}
store.accounts = []

console.log('Configuring server')


app.use((req, res, next) => {
    console.log(`${req.method}: ${req.url}`)
    next()
})

/* app.use((req, res, next) => {
    if(req.body){
        next()
    }
    else {
        res.status(401).send({msg:'Not authorized. Please provide an API KEY to access this service'})
    }
}) */

app.get('/', (req, res) => {
    res.status(200).send(store.accounts)
})

app
    .get('/accounts', (req, res) => {
        res.send(store.accounts)
    })
    .post('/accounts', (req, res) => {
        let newAccount = req.body
        let id = store.accounts.length
        store.accounts.push(newAccount)
        res.status(201).send({id:id})
    })
    .put('/accounts/:id', (req, res)=>{
        store.accounts[req.params.id] = req.body
        res.status(200).send(store.accounts[req.params.id])
    })
    .delete('/accounts/:id', (req, res) => {
        store.accounts.splice(req.params.id, 1)
        res.sendStatus(204)
    })

app.post('/transactions', (req, res) => {
    console.log(req.body)
    res.send({msg:'Transactions'})
})

app.all('*', (req, res) => {
    res.status(404).send({msg: 'URL not found on this server'})
})

console.log(`Starting server on port ${expressConfig.PORT}`)
app.listen(expressConfig.PORT)