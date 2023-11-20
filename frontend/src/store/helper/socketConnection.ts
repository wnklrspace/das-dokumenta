import { io } from 'socket.io-client'

const socketConnect = (token: string | undefined) => {
  const socket = io(
    'http://' + process.env.REACT_APP_IP_ADDRESS + ':' + process.env.REACT_APP_BACKEND_PORT,
    {
      auth: {
        token: token
      },
      closeOnBeforeunload: false,
      autoConnect: false
    }
  )

  return socket
}

export default socketConnect
