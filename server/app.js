const express = require('express')
const app = express()
const db = require("./connection")

const AuthRoute = require('./routes/Auth')

// const postModel = require("./postModel")

//So can accept json data
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/api', AuthRoute)

//POST
// app.post('/', async(req,res)=>{
//     const {email, password} = req.body

//     try{
//         const newUser = await postModel.create({email, password})
//         res.json(newUser)
//     }catch(err){
//         res.status(500).send(err) 
//     }
// })


app.listen(3000, ()=> {console.log("Listening at PORT 3000")})