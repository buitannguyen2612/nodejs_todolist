const express = require("express");
const router = express.Router();
const { todoList } = require("../models/model.js");
const validateToken = require("../middleware/validateTokenHandle.js");
const { json } = require("body-parser");

// adding middleware to all routes
router.use(validateToken);

// get all todolist in database
router.get("/getall", async function (req, res) {
  try {
    // this is get from middleware
    const infoUser = req.user;
    
    const allTodo = await todoList.find({ user: infoUser._id });
    res.status(200).json(allTodo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// add new todo to user
router.post("/addnew", async function (req, res) {
  try {
    // Tronng request gửi từ client cần 3 field user, name, isComplete
    const payload = {
      user: req.user._id,
      name: req.body.name,
      isComplete: req.body.isComplete,
    };
    const newTodo = new todoList(payload);
    const saveTodo = await newTodo.save();
    res.status(200).json(saveTodo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update todo list by id of todo
router.patch("/update/:id", async (rq, res) => {
  try {
    const { id } = rq.params;
    const allTodo = await todoList.findOneAndUpdate({ _id: id }, rq.body, {
      new: true,
    });
    res.status(201).json(allTodo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete todo from data
router.delete("/delete/:id", async (rq, res) => {
  try {
    const { id } = rq.params;
    const deleteTodo = await todoList.deleteOne({ _id: id });
    res.send(deleteTodo);
  } catch (error) {
    res.status(500).json(error);
  }
});

// complete task
router.patch("/complete/:id", async (rq, res) => {
  try {
    const todoID = rq.params.id;
    const findTodo = await todoList.findOneAndUpdate({ _id: todoID }, rq.body, {
      new: true,
    });
    res.status(201).json(findTodo);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// uncomplete task
router.patch("/uncomplete/:id", async (rq, res) => {
  try {
    const todoID = rq.params.id;
    const findTodo = await todoList.findOneAndUpdate({ _id: todoID }, rq.body, {
      new: true,
    });
    res.status(201).json(findTodo);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
