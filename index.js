const express = require('express'),
http = require('http'),
app = express(),
server = http.createServer(app),
io = require('socket.io').listen(server);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.send('Chat Server is running on port 3000')
});

let port = process.env.PORT || 3001
let trigger = false

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on("clicked", function() {
        socket.broadcast.emit('trigger', !trigger);
    })
    socket.on('join', function(userNickname = '') {
        console.log(userNickname +" : has joined the chat "  );
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    })
    socket.on('messagedetection', (senderNickname,messageContent) => {
        //log the message in console 
        console.log(senderNickname+" : " +messageContent)
        //create a message object 
        let  message = {"message":messageContent, "senderNickname":senderNickname}
        // send the message to all users including the sender  using io.emit() 
        io.emit('message', message )
      })
    socket.on('disconnect', function() {
        console.log(' has left ')
        socket.broadcast.emit( "userdisconnect" ,' user has left')
    })
})
    
server.listen(port, ()=>{
    console.log('Node app is running on port ', port)
})