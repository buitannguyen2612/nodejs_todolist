const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateTokenHandle.js");
const { json } = require("body-parser");
const { user, todoList } = require("../models/model.js");

// adding middleware to all routes
router.use(validateToken);

router.get("/getall", async (rq, res) => {
  try {
    const users = await user.aggregate([
      {
        $match: { role: { $ne: "admin" } }, // Filter out admin users
      },
      {
        $lookup: {
          from: "todolists", // The collection name in MongoDB
          localField: "_id",
          foreignField: "user",
          as: "todos",
        },
      },
      {
        $project: {
          userName: 1,
          email: 1,
          role: 1,
          todoCount: { $size: "$todos" }, // Count the number of todos
        },
      },
    ]);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.delete('/remove-user/:id', async(rq, res)=>{
  try {
    const { id } = rq.params;
    await user.deleteOne({_id:id})
    await todoList.deleteMany({user:id})
    res.status(201).send('Delete successfully')
    } catch (error) {
    res.status(500).send('Server error')
  }
})


router.put('/update-user/:id', async(rq,res) =>{
  try {
    const {id} = rq.params
    const isUser = user.find({_id:id})
    if(!isUser) return res.json(404).send('User not found')
    const filter = {_id: id}
    const updateRq = {
      userName:rq.body.userName,
      email:rq.body.email,
    }
    await user.findOneAndUpdate(filter, updateRq)
    res.status(204).send('Update successfully')
  } catch (error) {
    res.status(500).send('Server error')
  }
})
module.exports = router;
