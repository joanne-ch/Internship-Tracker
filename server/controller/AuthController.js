const User = require('../model/User')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const register = async (req, res, next) =>{
    const hashedPassword = await bcrypt.hash(req.body.password, 10).catch((err)=>{
        if(err) return next(err)
    })

    let newUser = new User({
        email : req.body.email,
        password : hashedPassword
    })

    await newUser.save().then(()=>{
        res.json({
            message: "User has been added successfully!"
        })
    }).catch((err)=>{
        res.json({
            message : "An error has occured!"
        })
    })
}

module.exports = {register}