const mongoose = require('mongoose')
require('dotenv').config()

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.qmgjbvn.mongodb.net/User?retryWrites=true&w=majority`

const connection = mongoose.connect(uri, connectionParams).then(()=>{console.log("Connected to MongoDB")}).catch((err)=>{console.log(err)})

module.exports = connection