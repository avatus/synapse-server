const app = require('express')();
const cors = require('cors')
const bodyParser = require('body-parser')

const db = require('./config/db')
db.init()

const http = require('http').createServer(app);
const redisAdapter = require('socket.io-redis');
const redis = require('redis')
const pub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_ENDPOINT, { auth_pass: process.env.REDIS_PASSWORD });
const sub = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_ENDPOINT, { auth_pass: process.env.REDIS_PASSWORD });
const io = require('socket.io')(http);
const requestIp = require('request-ip')
const identify = require('./config/identify')
const Controller = require('./controllers/socket.controller').SOCKET_FUNCTIONS(io)
const avatars = require('adorable-avatars')

app.use('/avatar', avatars)

io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
io.on('connection', Controller)

app.use(cors())
app.use(requestIp.mw())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(identify)

app.use('/auth', require('./routes/auth.routes'))
app.use('/sockets', require('./routes/socket.routes.js')(io))
app.use('/messages', require('./routes/message.routes.js'))


exports.io = io
exports.http = http