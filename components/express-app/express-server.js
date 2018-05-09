const express = require('express')
const ExpressConfig = require('./config/express-config.js')
const app = express()
const expressConfig = new ExpressConfig()

app.set('port', expressConfig.PORT)
app.set('views', expressConfig.VIEW_ENGINE)
app.set('view engine', expressConfig.VIEW_ENGINE)

app.get('/', (req, res) => {
    res.send('Welcome to the Jungle!')
})

app.listen()