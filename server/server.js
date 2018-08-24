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

    // welcome from admin when a user connects
    socket.emit("newMessage",{
        from:"admin",
        text:"welcome to the chat app"
    });
    //broadcast the welcome info

    socket.broadcast.emit("newMessage",{
        from:"Admin",
        text:"New user joined",
        createdAt: new Date().getTime()
    });
    
    socket.on("disconnect",()=>{
        console.log("User was disconnected!");
    });

    socket.on("createMessage", (newMessage)=>{
        console.log("createMessage from client",newMessage);

        
        io.emit("newMessage",{
            from: newMessage.from,
            text:newMessage.text,
            createdAt: new Date().getTime()
        });

        //send to other people excludes me
        // socket.broadcast.emit("newMessage",
        //     {
        //         from:newMessage.from,
        //         text: newMessage.text,
        //         createdAt: new Date().getTime()
        //     }
        // );
    });

  
});



app.use(express.static(publicPath));

server.listen(port ,()=>{
    console.log("Server starts!");
});
