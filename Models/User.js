const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
     name: { type: String, required: true,min:6 },
     email: { type: String, required: true ,min:6},
     password: { type: String, required: true ,min:6},
}, {
     timestamps:true
})
     
const User = mongoose.model('Users', userSchema)
module.exports=User