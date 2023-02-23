const express = require('express')
const app = express()
const db = require("./connection")

const AuthRoute = require('./routes/Auth')

const PORT = process.env.PORT || 5000
//So can accept json data
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api', AuthRoute)


app.listen(PORT, ()=> {console.log(`Listening at PORT ${PORT}`)})