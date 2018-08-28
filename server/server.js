const path = require("path");
const express = require("express");
const http = require("http");

const socketIO = require("socket.io");
const publicPath = path.join(__dirname  ,"../public");

const port = process.env.PORT || 3000;
const {generateMessage,generateLocationMessage} = require("./utils/message");
const app = express();
const server = http.createServer(app);
const {isRealString} = require('./utils/validation');
const io = socketIO(server);
const {Users} = require("./utils/users");
const users = new Users();

io.on("connection", (socket)=>{
    // console.log("New uer connected");

    // // welcome from admin when a user connects
    // socket.emit("newMessage",generateMessage("Admin","welcome to the chat app"));
    // //broadcast the welcome info
 

    socket.on("join", (params, callback) =>{
        if (!isRealString(params.name) || !isRealString(params.room)){
            callback("Name and room name are required");
        }
        
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        socket.emit("newMessage", generateMessage("Admin","Welcome to the chat app"));
        socket.broadcast.to(params.room).emit("newMessage",generateMessage("Admin", `${params.name} has joined`));

        io.to(params.room).emit("updateUserList",users.getUserList(params.room));

        callback();
    });
    socket.on("disconnect",()=>{
        console.log("User was disconnected!");
    });

    socket.on("createLocationMessage",(coords) =>{
        const user = users.getUser(socket.id);

        io.to(user.room).emit("newLocationMessage",generateLocationMessage(user.name, `${coords.latitude},${coords.longitude}`));
    });

    socket.on("disconnect", ()=>{
        const user = users.removeUser(socket.id);

        if (user){
            io.to(user.room).emit("updateUserList",users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("Admin", `${user.name} has left`));
        }
    });

    socket.on("createMessage", (newMessage,callback)=>{
        const user = users.getUser(socket.id);
        if (user && isRealString(newMessage.text)) {
            io.to(user.room).emit("newMessage",generateMessage(user.name, newMessage.text));
        }

    
    });

  
});



app.use(express.static(publicPath));

server.listen(port ,()=>{
    console.log("Server starts!");
});
