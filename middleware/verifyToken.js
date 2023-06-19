const jwt = require('jsonwebtoken')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.TOKEN_ENCRYPT);
const authModel=require ("../Models/AuthId")
async function auth (req, res, next)
{

     
     const entoken = req.cookies.authtoken
     console.log(req.cookies)
     const token = await cryptr.decrypt(entoken);
 
     if (!token)
     {
          res.status(401).send("denied")
     }
     else
     {
          //have to check with db if the save token is there in authids
          

          try {
               const verified =await jwt.verify(token, process.env.TOKEN_SECRET)
               const user = await authModel.findOne({ _id: verified._id })
               if (user.token===token)
               {
                    req.user = verified
                    console.log("user ggod")
               }
               next()
          }
          catch (err){
               res.status(401).send("access denied")
          }
     }
     
}
module.exports=auth