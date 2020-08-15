const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#message-form-input')
const $messageFormButton = document.querySelector('#message-form-send')
const $sendLocationButton = document.querySelector('#location-send')

socket.on('message', (msg) => {
    console.log(msg)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disables the send button
    $messageFormButton.setAttribute('disabled', 'disabled')

    let msg = $messageFormInput.value

    socket.emit('sendMessage', msg, (error) => {
        // Enables the send button
        $messageFormButton.removeAttribute('disabled')
        // Clears the input after sending the message
        $messageFormInput.value = ''
        // Assigns the cursor to input after sending the message
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    // Disables the send button
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
            // Enables the send button
            $sendLocationButton.removeAttribute('disabled')
            // Assigns the cursor to input after sharing location
            $messageFormInput.focus()
        })
    })
})

socket.on('location', (location) => {
    console.log(location)
})