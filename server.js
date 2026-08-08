//mongodb setup
const mongoose = require("mongoose");
const { MONGODB_URI } = require("./utils/config");
const dns = require('dns');
const app = require("./app");
dns.setServers(['8.8.8.8', '1.1.1.1']);
mongoose
    .connect(MONGODB_URI)
    .then(() =>{
        console.log("Connected to MongoDB");
        app
            .listen(PORT, HOST, () => {
                console.log(`Server running on http://${HOST}:${PORT}`);
            })
            .on('error', (error) => {
                console.error("Error starting server:", error.message);
            })
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });