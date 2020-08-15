const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('#message-form-input')
const $messageFormButton = document.querySelector('#message-form-send')
const $sendLocationButton = document.querySelector('#location-send')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (location) => {
    console.log(location)
    const html = Mustache.render(locationTemplate, {
        location
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disables the send button
    $messageFormButton.setAttribute('disabled', 'disabled')

    let message = $messageFormInput.value

    socket.emit('sendMessage', message, (error) => {
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
        socket.emit('locationMessage', {
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