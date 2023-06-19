const router = require("express").Router()
const userModel = require("../Models/User")
const authModel=require ("../Models/AuthId")
const { registerValidation, loginValidation } = require("../Models/Validation")
const bycrypt = require("bcrypt")
const jwt=require('jsonwebtoken')
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.TOKEN_ENCRYPT)
const verify =require("../middleware/verifyToken")

//REGISTER
router.post('/register', async (req, res) => {
     // Register validation
     const { error } = registerValidation(req.body)
     
     if (error)
     {
          res.status(400).send(error.details[0].message)}
     else {
     //checking if same email existes in DB
          const emailExist = await userModel.findOne({ email: req.body.email })
          if (emailExist)
          {
               res.status(400).send("email already exists")
          }
          else {

     //Hashing the password
               const salt = await bycrypt.genSalt(10)
               const hashedpassword=await bycrypt.hash(req.body.password,salt)
     //creating a new user
          
          const name = req.body.name
          const email = req.body.email
          const password = hashedpassword
          const newUser = new userModel({name,email,password});
          try {const hola= await newUser.save()
               res.send("you have been registered")}
          catch (err) { res.status(400).send(err) }
          }
     }     
})



//LOGIN
router.post("/login", async (req, res) => {
     //Login Validation
     const { error } = loginValidation(req.body)
     
     if (error)
     {
          res.status(400).send(error.details[0].message)
     }
     else
     {
          //Check if email is there in DB
          const user = await userModel.findOne({ email: req.body.email })
          if (!user)
          {
               res.status(400).send("check email or password")
          }
          else {
               //Check if the password is correct
               const validPassword = await bycrypt.compare(req.body.password, user.password)
               if (!validPassword)
               {
                    res.status(400).send("check email or password")
               }
               else {
                    //create a token
                    const token = jwt.sign({ _id: user._id,name:user.name }, process.env.TOKEN_SECRET,{
                         expiresIn: '1d' // expires in 365 days
                    })
                    
                    // add this token to the mongo DB
                    const _id = user._id
                    const newAuth = new authModel({
                         _id,
                         token
                    });
                    try {
                         const hola = await newAuth.save()
                         }
                    catch (err) { res.status(400).send(err) }

                    //sending cookies to the client side
                    const entoken = cryptr.encrypt(token); 
                    //,path:"/user"  ,domain:"http://localhost:5000"
                    res.cookie('authtoken',entoken,{httpOnly:true,sameSite:"lax"})
                    res.send("you are logged in")
               }

          }
     }   
})

//Logout
router.delete("/logout",verify ,async (req, res) => {
          authModel.findByIdAndDelete(req.user._id)
               .then(() => {
                    res.clearCookie("authtoken").send("uid has been deleted")
               })
               .catch((err)=>{res.status(400).json(err)})
})
module.exports = router;