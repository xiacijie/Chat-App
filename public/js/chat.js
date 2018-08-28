var socket = io();

function scrollToBottom(){
    var messages = $("#messages");
    var newMessage = messages.children("li:last-child");

    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");

    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function(){
    var params = $.deparam(window.location.search);
    socket.emit("join",params,function(err){
        if (err){
            alert(err);
            window.location.href ="/";
        } else{
            console.log("No error");
        }
    });
    console.log("Connected to server");

});

socket.on("disconnct", function(){
    console.log("Disconncted from server");
});

socket.on("updateUserList",function(users){
    var ol = $("<ol></ol>");
    users.forEach(function(user){
        ol.append($("<li></li>").text(user));
    });


    $("#users").html(ol);
});
socket.on("newMessage", function(message){
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = $("#message-template").html();
    var html = Mustache.render(template,{
        text:message.text,
        from: message.from,
        createdAt: formattedTime
    });
    $("#messages").append(html);
    scrollToBottom();
    // console.log("new messgae from server",message);
    // var li = $("<li></li>");
    // li.text(`${message.from} ${formattedTime} : ${message.text}`);
    // $("#messages").append(li);
});

socket.on("newLocationMessage", function(message){
    var formattedTime = moment(message.createdAt).format("h:mm a");
    var template = $("#location-template").html();
    var html = Mustache.render(template,{
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $("messages").append(html);
    scrollToBottom();
    // var li = $("<li></li>");
    // var a = $("<a target='_blank'>My Current Location</a>");
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

var locationButton = $("#send-location");
var messageTextBox = $("[name=message]");
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