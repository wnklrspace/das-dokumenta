import { io } from 'socket.io-client'

// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.REACT_APP_ENV === 'production'
    ? undefined
    : 'http://' + process.env.REACT_APP_IP_ADDRESS + ':' + process.env.REACT_APP_BACKEND_PORT

export const socket = io(URL, { transports: ['websocket'] })
