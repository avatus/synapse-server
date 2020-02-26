const User = require('../models/user.model')

exports.SOCKET_FUNCTIONS = async (socket) => {
    const id_token = socket.handshake.query.id_token || null
    if (!id_token) {
        socket.emit('disconnect_message', "Invalid or null token found on socket handshake. Disconnecting...")
        return socket.disconnect('messagehere')
    }

    const user = await User.findOne({id_token})

    if (user === null) {
        let newUser = new User({
            id_token,
            socket: socket.id
        })
        newUser.save()
    }
    else {
        user.socket = socket.id
        user.save()
    }

    socket.on('disconnect', () => {
        console.log(`disconnected: ${id_token}`);
    })

    socket.on('SEND_MESSAGE', message => {
        io.of('/').adapter.remoteJoin(socket.id, 'room1', (err) => {
            if (err) { console.log( err) }
            console.log('joined')
        });
        const text = message.text.trim()
        if (text === "!rooms") {
            return console.log('room command')
        }
        return socket.broadcast.emit('RECEIVE_MESSAGE', message);
    })
}

exports.getAllRooms = io => async (req, res) => {
    try {
        io.of('/').adapter.allRooms((err, rooms) => {
            console.log(rooms)
        });

    } catch (error) {
        console.log(error)
        return status(500).json({message: error.message})
    }
    return res.status(200).json()
}