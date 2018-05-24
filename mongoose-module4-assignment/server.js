const config = require('./config.js')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const routes = require('./routes.js')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(logger('dev'))

app.use('/', routes)

app.listen(config.httpPort, () => {
    console.log(`Listening on port ${config.httpPort}`)
})



