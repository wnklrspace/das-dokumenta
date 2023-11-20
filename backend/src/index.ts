import server from './server'

const PORT = process.env.BACKEND_PORT

server.listen(PORT, () => {
  console.log('Server is running on port: ', PORT)
})
