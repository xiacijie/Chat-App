const socket = io();
socket.on("connect", function(){
    console.log("Connected to server");

});

socket.on("disconnct", function(){
    console.log("Disconncted from server");
});

socket.on("newMessage", function(message){
    console.log("new messgae from server",message);
    const li = $("<li></li>");
    li.text(`${message.from} : ${message.text}`);
    $("#messages").append(li);
});

// socket.emit("createMessage",{
//     from:"jack",
//     text: "HI"
// },function(info){
//     console.log("got it",info);
// });


$("#message-form").on("submit",function(e){
    e.preventDefault();
   
    socket.emit("createMessage",{
        from:"User",
        text: $("[name=message]").val()
    },function (){

    });
});