const path = require("path");
const express = require("express");
const http = require("http");

const socketIO = require("socket.io");
const publicPath = path.join(__dirname  ,"../public");

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket)=>{
    console.log("New uer connected");

    socket.on("disconnect",()=>{
        console.log("User was disconnected!");
    });
});



app.use(express.static(publicPath));

server.listen(port ,()=>{
    console.log("Server starts!");
});
