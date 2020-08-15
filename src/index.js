const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    // detects if a new user has joined, and inform other users in the conversation
    socket.emit('message', generateMessage('Welcome to the conversation!'))
    socket.broadcast.emit('message', generateMessage('A new user has joined the conversation!'))

    // receives a message from a user, and sends back that message to other users in the
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed.')
        }

        io.emit('message', generateMessage(message))
        callback()
    })

    // receives a location from a user, and sends back that location to other users in the conversation
    socket.on('locationMessage', (coordinates, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`))
        callback()
    })

    // detects if a user has leave the conversation
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left the conversation.'))
    })
})

server.listen(port, () => {
    console.log('Server is up on port ' + port + '.')
})