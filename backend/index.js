const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const {router} = require("./routes/routes")
const {connectDB} = require("./config/connectDB")
const app = express();
dotenv.config()

//dbconfig
connectDB(process.env.MONGO_URL)


//middlewares
app.use(express.json());
app.use(cors());

//route config
app.use("/api" , router);


//server
const portNo = process.env.PORT;
app.listen(portNo , ()=>{console.log(`listening on port ${portNo}`)});