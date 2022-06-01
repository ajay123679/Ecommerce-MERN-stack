const express = require('express')
/*const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { application } = require("express");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if(!user){
        return res.status(401).json("Wrong credentials!");
    }
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if(OriginalPassword !== req.body.password){
        return res.status(401).json("Wrong credentials!");
    }
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
      
    );

    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/logout', async (req, res, next) => {
  res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
  });
  res.status(200).json({
      success: true,
      data: {}
  })
})


const sendTokenResponse = (user, statusCode, res) => {
  // console.log(user)
  // Create a token
  const token = user.getSignedJwtToken();
  console.log(token)
  const options = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true
  }

  res.status(statusCode)
      .cookie('token', token, options)
      .json({
          success: true,
          user: user,
          token: token
      })
}


module.exports = router;*/

const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
//const session = require("express-session")
const app = express();
app.use(express.json());
app.use(cookieParser());
// Importing file-store module
//const filestore = require("session-file-store")(session)
//app.use(cookieParser())
//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong credentials!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json("Wrong credentials!");

    /*const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      {expiresIn:"3d"}
    );
    user.tokens=user.tokens.concat({token:token});
    user.save();*/
    
    const { password, ...others } = user._doc;
    const token=await user.generateAuthToken();
    res.cookie("jwtoken",token,{
      expires:new Date(Date.now()+25892000000),
      httpOnly:true
    })
    res.status(200).json({...others, token});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;