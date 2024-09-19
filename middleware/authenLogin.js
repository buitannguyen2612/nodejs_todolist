const { user } = require("../models/model.js");
const bcrypt = require("bcrypt");

const authLogin = async (rq, res, next) => {
  // Username
  const findUser = await user.findOne({
    userName: rq.body.userName,
  });
  if (findUser === null) {
    res.status(404).send('Account not found!!')
  } else {
    rq.user = findUser;
    next();
  }
};

module.exports = authLogin;
