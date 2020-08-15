const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    const msg = 'Welcome to the conversation!'

    // detects if a new user has joined, and inform other users in the conversation
    socket.emit('message', msg)
    socket.broadcast.emit('message', 'A new user has joined the conversation!')

    // receives a message from a user, and sends back that message to other users in the
    socket.on('replyMessage', (msg, callback) => {
        io.emit('message', msg)
        callback()
    })

    // receives a location from a user, and sends back that location to other users in the conversation
    socket.on('sendLocation', (coordinates) => {
        io.emit('location', `https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`)
    })

    // detects if a user has leave the conversation
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the conversation.')
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})