const socket = io();
socket.on("connect", function(){
    console.log("Connected to server");

    socket.emit("createMessage",{to:"xiacijie",text:"fuck"});
});

socket.on("disconnct", function(){
    console.log("Disconncted from server");
});

socket.on("newMessage", function(message){
    console.log("new messgae from server",message);
});