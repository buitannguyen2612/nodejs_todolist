const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const todoRoutes = require("./routes/todoRouter.js");
const autheRouter = require("./routes/authen.js");
const adminRouter = require("./routes/adminManage.js");

// providing to routes to ENV file
dotEnv.config();
//connect database mongodb
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connected!"))
  .catch((err) => {
    console.log(err);
  });

//Its same to using express.json and urlencoded
app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cors());

// Truy xuất vào bên trong router và cho phép sử dụng các endpoint có bên trong
// route-1: Chứa action endpoint cho các tương tác data todolist
app.use("/todo", todoRoutes);
// route-2: Chứa các endpoint cho các tương tác login và register
app.use("/user", autheRouter);
app.use("/admin", adminRouter);

const port = process.env.PORT || 8080;
const hostname = "127.0.0.1";

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
