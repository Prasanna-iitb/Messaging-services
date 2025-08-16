const mongoose = require("mongoose");

const connectDB = async (url) => {
    try{
        const con = await mongoose.connect(url);
        console.log(`MongoDB connected at ${con.connection.host}`);
    }
    catch{
        console.log('Error connecting to database');
    }
}

module.exports = {
    connectDB,
}