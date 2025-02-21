const { log } = require("console");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

//new io on the express server
const io = require("socket.io")(server);

//host index.html in public file
app.use(express.static(path.join(__dirname, "public")));

//set to store unique users
let socketConnected= new Set();

io.on("connection", onConnected);


//socket connected handler
function onConnected(socket){

   
    //add new client id to the Set
    socketConnected.add(socket.id);
    
    //send the total client size
    io.emit('clients-total', socketConnected.size);

    //socket disconnect handler
    socket.on('disconnect', ()=>{
        //remove socket.id from the set after closed connection
        socketConnected.delete(socket.id);
        //send the new total people size
        io.emit('clients-total', socketConnected.size);
    })

    //send message data handler
    socket.on('send-message', (data)=>{
        socket.broadcast.emit('receive-message', data);
    })

    //who is typing
    socket.on('typing',(data)=>{
        console.log("socket type data", data)
        socket.broadcast.emit("typing", data);
    })

}



