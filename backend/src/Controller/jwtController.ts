import jwt from 'jsonwebtoken'
import { Request } from 'express'

const jwtSign = (payload: any, secret: string, options: any) =>
  new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })

const jwtVerify = (token: string, secret: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })

const getJwt = (req: Request) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }
}

export { jwtSign, jwtVerify, getJwt }
