const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const authSchema = new Schema({
     _id:{ type:String, required:true, min:6 },
     token: { type: String, required: true ,min:6},
})
     
const Auth = mongoose.model('AuthID', authSchema)
module.exports=Auth