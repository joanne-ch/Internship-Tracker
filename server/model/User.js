const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        unique: true
    },
    //TBD: Add password restriction
    password: {
        type: String,
        required: true
    },
    isValid : {
        type: Boolean,
        default: false,
        required: true
    }

}, {timestamps: true})

const User = mongoose.model('user_info', UserSchema)
module.exports = User