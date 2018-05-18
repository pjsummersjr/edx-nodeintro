const express = require('express')
const bodyParser = require('body-parser')
const errorHandler = require('errorhandler')
const logger = require('morgan')
const routes = require('./routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use(logger('dev'))
app.use(errorHandler())
app.use('/posts', routes)


app.listen(3001)