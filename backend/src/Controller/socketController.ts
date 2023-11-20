import { jwtVerify } from './jwtController'

const authorizeUser = (socket: any, next: any) => {
  const token = socket.handshake.auth.token

  jwtVerify(token, process.env.JWT_SECRET || '')
    .then((decoded: any) => {
      socket.user = { ...decoded }
      next()
    })
    .catch((err) => {
      console.log(err)
      next(new Error('Not authorized'))
    })
}

export { authorizeUser }
