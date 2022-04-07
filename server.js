//import statements
const express=require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const fs = require("fs");

//config
dotenv.config();
const port = process.env.PORT || 8000;
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection success"))
  .catch((err) => console.log(err));

//app initialise
const app=express();


//app middlewares
app.use(cors());
app.use(morgan("dev"))
app.use(express.json());
fs.readdirSync(`${__dirname}/routes`).forEach((file) => {
   app.use("/api", require(`./routes/${file}`))
})

//app routes
app.get("/", (req, res) => {
    res.send("Hey realtime project")
})

//app listen or start
app.listen(port,()=> console.log(`server started at port ${port}`))