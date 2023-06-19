const router = require("express").Router()
const verify =require("../middleware/verifyToken")
const jwt = require('jsonwebtoken')
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.TOKEN_ENCRYPT);


router.post('/link', verify,async (req, res) => {
      
          

          res.send(req.user)
          
          
})

module.exports = router;