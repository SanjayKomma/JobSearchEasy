const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
mongoose
    .connect(MONGODB_URI)
    .then(() =>{
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });