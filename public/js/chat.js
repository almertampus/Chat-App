const socket = io()

socket.on('message', (msg) => {
    console.log(msg)
})

document.querySelector('#messageForm').addEventListener('submit', (e) => {
    e.preventDefault()

    let msg = e.target.elements.msg.value

    socket.emit('replyMessage', msg, (message) => {
        console.log(message)
    })

    // clears the input field after sending the message
    e.target.elements.msg.value = ''
})

document.querySelector('#send-location').addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    })
})

socket.on('location', (location) => {
    console.log(location)
})