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

socket.on("newLocationMessage", function(message){
    const li = $("<li></li>");
    const a = $(<a target="_blank">My Current Location</a>);
    li.text(`${message.from}: `);
    a.attr("href",message.url);
    li.append(a);
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

const locationButton = $("#send-location");
locationButton.on("click", function(){
   
    if (!navigator.geolocation){
        return alert("Geolocation not supported");
    }

    navigator.geolocation.getCurrentPosition(function(position){
        socket.emit("createLocationMessage",{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    },function(){
        alert("Unable to fetch location");
    });
})