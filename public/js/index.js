const socket = io();
socket.on("connect", function(){
    console.log("Connected to server");

});

socket.on("disconnct", function(){
    console.log("Disconncted from server");
});

socket.on("newMessage", function(message){
    console.log("new messgae from server",message);
});

socket.emit("createMessage",{
    from:"jack",
    text: "HI"
},function(info){
    console.log("got it",info);
});