const jwt = require("jsonwebtoken");
const { UserToken } = require("../models/model.js");
const dotEnv = require("dotenv");
dotEnv.config();

const generateTokens = async (user) => {
  try {
    const payload = { _id: user._id, name: user.userName, role:user.role, mail:user.email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "6d",
    });
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: "30d" }
    );
    const findToken = await UserToken.find({ userId: user._id });
    if (findToken) {
      await UserToken.findOneAndDelete({
        userId: user._id,
        function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Deleted User : ", docs);
          }
        },
      });
    }
    const addNewToken = await new UserToken({
      userId: user._id,
      token: refreshToken,
    });
    await addNewToken.save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    console.log("genarate token err");
    return Promise.reject(err);
  }
};

module.exports = generateTokens;
