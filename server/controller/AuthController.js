//modal used
const User = require('../model/User')
const EmailToken = require('../model/EmailToken')

//packages used
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const handlebars = require('handlebars');
const fs = require('fs');
const { off } = require('process')


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

    const token = jwt.sign(
        { data: 'Token Data' },
        'ourSecretKey',
        { expiresIn: '10m' } );

    let newUser = new User({
        email : req.body.email,
        password : hashedPassword
    })

    let newEmailToken = new EmailToken({
        user_id: newUser._id,
        token: token
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
        if (err) {
            console.log('error reading file', err);
            return;
        }
        var template = handlebars.compile(html);
        var replacements = {
            token: token
       };

        var htmlToSend = template(replacements);

        const mailConfigurations = {
            from: 'internshiptrackertest@gmail.com',
            to : newUser.email,
            subject: 'Email Verification',
            html: htmlToSend
        }

        transporter.sendMail(mailConfigurations, function(err, res){
            if (error) {
                console.log(error);
            }
            console.log("Email sent successfully")
            console.log(info)
        })
    })

    await newUser.save().then(()=>{
        newEmailToken.save().catch((err)=>{console.log(err)})
        res.json({
            message: "User has been added successfully!"
        })
    }).catch((err)=>{
        if(err.name === "ValidationError"){
            res.json({
                message: "The email you entered has been previously registered!"
            })
        }
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
        else{

            const findToken = function findToken(token, callback){
                EmailToken.findOne({token: token}, function(err, userObj){
                    if(err){
                        return callback(err);
                    } else if (userObj){
                        return callback(null,userObj);
                    } else {
                        return callback();
                    }
                });
            }

            const tokenFound = findToken(token, function(err, tokenFound){
                //console.log("INSIDE THE FUNC")
                console.log(tokenFound)
                console.log(token.user_id)
                User.findOneAndUpdate({_id : tokenFound.user_id}, {$set : {isValid: true}}).then(()=>{console.log("Successfully updated")}).catch(()=>{"User Verified status not yet updated"})
            })

            // const verifiedToken = EmailToken.findOne({token : token}, function(err, callback){
            // })
            //.select({'user_id' : 1, "_id": 0})
            //console.log("OUTSIDE FUNC")
            //console.log(tokenFound)
            //console.log(tokenFound.user_id)
            //User.findOneAndUpdate({_id : tokenFound.user_id}, {$set : {isValid: true}}).then(()=>{console.log("Successfully updated")}).catch(()=>{"User Verified status not yet updated"})
            res.send("Email verified successfully")
        }
    })
}

module.exports = {register, verify}