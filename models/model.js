const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isComplete: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    required:true
  },
  todo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todoList",
    },
  ],
});

const userTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 30 * 86400 }, // 30 days
});

let todoList = mongoose.model("todoList", todoSchema);
let user = mongoose.model("user", userSchema);
let UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = { todoList, user, UserToken };
