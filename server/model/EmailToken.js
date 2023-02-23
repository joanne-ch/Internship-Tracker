const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const EmailTokenSchema = mongoose.Schema({
    user_id:{
        type: mongoose.ObjectId,
        required: true,
        unique: true
    },
    token:{
        type: String,
        required:true
    }
}, {timestamps: true})

EmailTokenSchema.plugin(uniqueValidator)
const EmailToken = mongoose.model('user_token', EmailTokenSchema)
module.exports = EmailToken