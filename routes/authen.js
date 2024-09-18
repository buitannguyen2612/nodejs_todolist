const express = require("express");
const router = express.Router();
const { user, UserToken } = require("../models/model.js");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
// providing process to join the env file
const dotEnv = require("dotenv");
const generateTokens = require("../utils/generateTokens.js");
const verifyRefreshToken = require("../utils/verifyRefreshToken.js");
const validateToken = require("../middleware/validateTokenHandle.js");
const authLogin = require("../middleware/authenLogin.js");
dotEnv.config();
// ending

// login with current account
router.post("/login", authLogin, async (rq, res) => {
  // using middleware to checking the username is exist or not
  try {
    let infomationUser;
    let tokenLifespan;
    const isSamePass = await bcrypt.compare(rq.body.password, rq.user.password);
    if (!isSamePass) {
      res.send("Password not correct");
    } else {
      const { accessToken, refreshToken } = await generateTokens(rq.user);
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, decoded) {
          if (err) {
            console.log("vertify err", err);
          }
          infomationUser = decoded;
          tokenLifespan = decoded.exp;
        }
      );
      // resp all inmformation of token decoded
      res.status(200).json({
        error: false,
        infomationUser,
        accessToken,
        refreshToken,
        message: "Logged in sucessfully",
        tokenLifespan,
      });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// register new account
router.post("/register", async (rq, res) => {
  try {
    const data = {
      userName: rq.body.userName,
      password: rq.body.password,
      email:rq.body.email,
      role:rq.body.role
    };
    console.log('Catch request', data);
    
    
    // Check if name user is already have
    const exitUserName = await user.findOne({ userName: data.userName });
    if (exitUserName) {
      res.status(409).send("Account already taken");
    } else {
      // if not the system will hash the password and pass to the collection in mongodb
      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;
      const addnewUser = new user(data);
      const saveUser = await addnewUser.save();
      res.status(201).json({ saveUser, message: "Signup successfull" });
    }
  } catch (error) {
    res.status(500, "Sever error");
  }
});

// get all user in system
router.get("/getall", async (rq, res) => {
  try {
    const allUser = await user.find();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(500).send("There are some problem in server");
  }
});

// get new accesstokenn and return new token
router.post("/refresh", async (req, res) => {
  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      let tokenLifespan = "10s";
      const payload = { _id: tokenDetails._id, name: tokenDetails.name };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: tokenLifespan,
      });
      res.status(200).json({
        error: false,
        accessToken,
        tokenLifespan,
        message: "Access token created successfully",
      });
    })
    .catch((err) => res.status(400).json(err));
});

// logout and delete current tokenf
router.delete("/logout", async (req, res) => {
  try {
    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Sucessfully" });

    await UserToken.remove();
    res.status(200).json({ error: false, message: "Logged Out Sucessfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

router.get("/getcurrent", validateToken, async (rq, res) => {
  res.json(rq.user);
});

module.exports = router;
