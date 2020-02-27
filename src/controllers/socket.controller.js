const User = require('../models/user.model')
const Room = require('../models/room.model')

exports.SOCKET_FUNCTIONS = io => async (socket) => {
    const id_token = socket.handshake.query.id_token || null
    if (!id_token) {
        socket.emit('disconnect_message', "Invalid or null token found on socket handshake. Disconnecting...")
        return io.of('/').adapter.remoteDisconnect(socket.id, true)
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
        user.rooms.forEach(room => {
            io.of('/').adapter.remoteJoin(socket.id, room, (err) => {
                if (err) {
                    return socket.emit('JOIN_ROOM_ERROR', err)
                }
                return socket.emit('JOINED_ROOM', )
            });
        })
    }

    socket.on('disconnect', () => {
        // console.log(`disconnected: ${id_token}`);
    })

    socket.on('SEND_MESSAGE', async message => {
        const text = message.text.trim()
        if (text.startsWith("/join")) {
            let args = text.split(' ')
            let room_name = args[1]
            const user = await User.findOne({id_token})
            if (user !== null) {
                if (!user.rooms.includes[room_name]) {
                    user.rooms.push(room_name)
                    user.save()
                }
            }


            io.of('/').adapter.remoteJoin(socket.id, room_name, (err) => {
                if (err) {
                    return socket.emit('JOIN_ROOM_ERROR', err)
                }
                return socket.emit('JOINED_ROOM', )
            });

            return
        }
        return socket.broadcast.emit('RECEIVE_MESSAGE', message);
    })
}

exports.getAllRooms = io => (req, res) => {
    try {
        io.of('/').adapter.allRooms((err, rooms) => {
            return res.status(200).json(rooms)
        })
    } catch (error) {
        console.log(error)
        return status(500).json({message: error.message})
    }
}

exports.getRoomInfo = io => (req, res) => {
    const room = req.params.room
    try {
        io.of('/').adapter.clients([room], (err, clients) => {
            console.log(clients); 
            return res.status(200).json(clients)
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}