const socket = io();

function scrollToBottom(){
    const messages = $("#messages");
    const newMessage = messages.children("li:last-child");

    const clientHeight = messages.prop("clientHeight");
    const scrollTop = messages.prop("scrollTop");
    const scrollHeight = messages.prop("scrollHeight");

    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function(){
    console.log("Connected to server");

});

socket.on("disconnct", function(){
    console.log("Disconncted from server");
});

socket.on("newMessage", function(message){
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const template = $("#message-template").html();
    const html = Mustache.render(template,{
        text:message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $("#messages").append(html);
    scrollToBottom();
    // console.log("new messgae from server",message);
    // const li = $("<li></li>");
    // li.text(`${message.from} ${formattedTime} : ${message.text}`);
    // $("#messages").append(li);
});

socket.on("newLocationMessage", function(message){
    const formattedTime = moment(message.createdAt).format("h:mm a");
    const template = $("#location-template").html();
    const html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $("messages").append(html);
    scrollToBottom();
    // const li = $("<li></li>");
    // const a = $("<a target='_blank'>My Current Location</a>");
    // li.text(`${message.from} ${formattedTime}: `);
    // a.attr("href",message.url);
    // li.append(a);
    // $("#messages").append(li);
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
        messageTextBox.val("");
    });
});

const locationButton = $("#send-location");
const messageTextBox = $("[name=message]");
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