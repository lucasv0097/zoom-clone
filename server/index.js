const server = require('http').createServer((request, response) => {
  response.writeHead(204, {
    'Access-Contrl-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
  })
  response.end('hello world!')
})

const socketIo = require('socket.io')
const io = socketIo(server, {
  cors: {
    origin: '*',
    credentials: false,
  },
})

io.on('connection', (socket) => {
  console.log('connection', socket.id)
  socket.on('join-room', (roomId, userId) => {
    // adiciona os usuarios na mesma sala
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
    console.log('user connected!', userId)

    socket.on('disconnected', () => {
      console.log('disconnected!', roomId, userId)
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

const startServer = () => {
  const { address, port } = server.address()
  console.info(`app running at ${address}:${port}`)
}
server.listen(process.env.PORT || 3000, startServer)
