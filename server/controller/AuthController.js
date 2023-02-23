const User = require('../model/User')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const handlebars = require('handlebars');
const fs = require('fs');


//TBD: Display mssg duplicate email if got duplicate email
const register = async (req, res, next) =>{
    const readHTMLFile = function(path, callback) {
        fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
            if (err) {
               callback(err);                 
            }
            else {
                callback(null, html);
            }
        });
    };

    const hashedPassword = await bcrypt.hash(req.body.password, 10).catch((err)=>{
        if(err) return next(err)
    })

    let newUser = new User({
        email : req.body.email,
        password : hashedPassword
    })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
            user: "internshiptrackertest@gmail.com",
            pass: "orfihvjalmerfahg"
        }
    })

    //send email using html template
    readHTMLFile(__dirname + '/email_template/askVerification.html', function(err, html){
        const token = jwt.sign(
            { data: 'Token Data' },
            'ourSecretKey',
            { expiresIn: '10m' } );    
        
        if (err) {
            console.log('error reading file', err);
            return;
        }
        var template = handlebars.compile(html);
        var replacements = {
            token: token
       };
        console.log(token)
        var htmlToSend = template(replacements);

        const mailConfigurations = {
            from: 'internshiptrackertest@gmail.com',
            to : newUser.email,
            subject: 'Email Verification',
            html: htmlToSend
        }

        console.log("I HAVE REACHED THIS PART??")
        transporter.sendMail(mailConfigurations, function(err, res){
            if (error) {
                console.log(error);
            }
            console.log("Email sent successfully")
            console.log(info)
        })
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

const verify = async(req, res, next) =>{
    const {token} = req.params;

    jwt.verify(token, 'ourSecretKey', function(err, decoded){
        if(err){
            console.log(err)
            res.send("Email verification failed, the link is invalid or expired.")
        }
        else
            res.send("Email verified successfully")
    })
}

module.exports = {register, verify}