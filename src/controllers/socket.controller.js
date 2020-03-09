const User = require('../models/user.model')
const Room = require('../models/room.model')
const RecentMessages = require('../models/recentMessage.model')
const randomstring = require('randomstring')

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
        socket.emit('USER_ROOM_LIST', [])
    }
    else {
        user.socket = socket.id
        user.rooms.forEach(room => {
            io.of('/').adapter.remoteJoin(socket.id, room, (err) => {
                if (err) {
                    socket.emit('JOIN_ROOM_ERROR', err)
                }
                else {
                    // io.in(room.name).emit('USER_JOINED_ROOM', {room: room.name, id_token: user.id_token});
                    // io.in(room).emit('USER_JOINED_ROOM', {room, id_token: user.id_token});
                }
            });
        })
        user.save()
        socket.emit('USER_ROOM_LIST', user.rooms)
    }

    socket.on('disconnecting', () => {
        io.of('/').adapter.clientRooms(socket.id, (err, rooms) => {
            if (err) { console.log(err) }
            rooms.forEach(room => {
                // io.in(room).emit('USER_LEFT_ROOM', room)
            })
        });
    })

    socket.on('disconnect', () => {
        // io.in(room).emit('USER_LEFT_ROOM', {room, message});
    })

    socket.on('GET_ROOM_USER_COUNT', room => {
        io.in(room).clients((err, clients) => {
            return io.in(room).emit('UPDATE_ROOM_USER_COUNT', {room, users: clients.length});
        })
    })

    socket.on('SEND_MESSAGE', async ({room, message}) => {
        const db_room = await Room.findOne({name: room})
        let history = db_room.history.slice(-99)
        message.delivered = true
        history.push(message)
        db_room.history = history
        db_room.save()
        let newRecentMessage = new RecentMessages({
            room,
            message,
        })
        newRecentMessage.save()
        // let users = await User.find().where('rooms').in([room])
        // users.forEach(u => {
        //     let unread
        //     if (u.unread) {
        //         unread = u.unread
        //     }
        //     else {
        //         unread = {}
        //     }
        //     unread[room] ? unread[room] += 1 : unread[room] = 1
        //     u.unread = unread
        //     u.save()
        // })
        // console.log(users.length)
        return io.in(room).emit('ROOM_MESSAGE', {room, message});
    })

    socket.on('USER_RECONNECTED', async ({id}) => {
        let user = await User.findOne({id_token: id})
        if (user !== null) {
            user.socket = socket.id
            user.save()
        }
    })
}

exports.getAllRooms = io => async (req, res) => {
    try {
        let rooms = await Room.find().select('-history')
        const recentMessages = await RecentMessages.find()
        const socketRoomInfo = io.of('/').adapter.rooms
        rooms.forEach(r => {
            if (socketRoomInfo[r.name]) {
                r.users = socketRoomInfo[r.name].length
            }
        })
        io.of('/').adapter.clients((err, clients) => {
            if (err) {
                return res.status(500).json({message: "error loading dashboard..."})
            }
            return res.status(200).json({rooms, clients: clients.length, recentMessages})
        });
    } catch (error) {
        console.log(error)
        return status(500).json({message: error.message})
    }
}

exports.getRoomInfo = io => async (req, res) => {
    const name = req.params.room
    const { id_token } = req
    try {
        let room = await Room.findOne({ name })
        if (room === null) {
            room = new Room({ name })
            room.save()
        }

        if (!id_token) {
            return res.status(400).json({message: "Invalid or missing identification token"})
        }

        const user = await User.findOne({id_token})
        if (user !== null) {
            if (!user.rooms.includes(room.name)) {
                user.rooms = user.rooms.concat([room.name])
                user.save()
                // io.in(room.name).emit('USER_JOINED_ROOM', {room: room.name, id_token: user.id_token});
            }
            io.of('/').adapter.remoteJoin(user.socket, name, (err) => {
                if (err) {
                    console.log(err)
                }
            });
        }

        io.in(name).clients((err, clients) => {
            if (err) {
                return res.status(500).json({message: err})
            }
            return res.status(200).json({
                room_name: name,
                users: clients.length,
                history: room.history,
            })
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

exports.getRandomRoom = io => async (req, res) => {
    try {

        const user = await User.findOne({id_token: req.id_token})
        if (user === null) {
            return res.status(404).json({message: "Identification token not found."})
        }

        io.of('/').adapter.clientRooms(user.socket, async (err, rooms) => {
            if (err) { console.log(err) }
            let filteredRooms = await Room.find().where('name').nin(rooms)
            if (filteredRooms.length <1) {
                return res.status(200).json({room: randomstring.generate(12)})
            }
            else {
                const names = filteredRooms.map(r => r.name)
                const randomRoom = names[Math.floor(Math.random() * names.length)]
                return res.status(200).json({room: randomRoom})

            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
    return res.status
}

exports.regenIdToken = io => async (req, res) => {
    const id_token = req.id_token
    try {
        const user = await User.findOne({id_token})
        if (user === null) {
            return res.status(400).json({message: "id_token could not be refreshed"})
        }

        const newToken = randomstring.generate()

        user.id_token = newToken

        await user.save()

        return res.status(200).json({id_token: newToken})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

exports.leaveRoom = io => async (req, res) => {
    const id_token = req.id_token
    const data = req.body
    try {
        const user = await User.findOne({id_token})
        if (user === null) {
            return res.status(400).json({message: "id_token could not be refreshed"})
        }

        user.rooms = user.rooms.filter(r => r !== data.room)
        io.of('/').adapter.remoteLeave(user.socket, data.room, (err) => {
            if (err) {
                console.log(err)
            }
        });
        await user.save()

        return res.status(200).json({rooms: user.rooms})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}