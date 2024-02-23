//external imports 
const mongoose = require("mongoose");
require('dotenv').config()

async function connectDB(){
    //use mongoose to connect this app to our database on mongoDB using the DB_URL
    mongoose
        .connect(
            process.env.DB_URL
        )
        .then(() => {
            console.log("Succesfully connected to MongoDB Atlas!");
        })
        .catch((error) => {
            console.log("Unable to connect to MongoDB Atlas!");
            console.log(error);
        });

}

module.exports = connectDB;