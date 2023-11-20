import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getJwt, jwtVerify } from './jwtController'
import User from '../models/User'
import { ErrorMessages } from '../types/Errors'

const handleLogin = async (req: Request, res: Response) => {
  const token = getJwt(req)

  if (!token) {
    res.json({ isLoggedIn: false })
    return
  }

  jwtVerify(token, process.env.JWT_SECRET || '')
    .then(async (decoded: any) => {
      const potentialUser = await User.findOne({ userName: decoded.userName })

      if (!potentialUser) {
        res.json({ isLoggedIn: false, user: null, token: null })
        return
      }

      res.json({
        isLoggedIn: true,
        user: {
          _id: decoded._id,
          userName: decoded.userName,
          name: decoded.name,
          email: decoded.email
        },
        token: token
      })
    })
    .catch((err: any) => {
      console.log(err)
      res.json({ isLoggedIn: false, user: null, token: null })
    })
}

const attemptLogin = async (req: Request, res: Response) => {
  try {
    const userName = req.body.userName
    const password = req.body.password

    const potentialUser = await User.findOne({ userName: userName })

    if (!potentialUser) {
      return res.status(403).json({
        status: ErrorMessages.USER_NOT_FOUND
      })
    }

    const passwordMatch = await bcrypt.compare(password, potentialUser.passwordHash)

    if (!passwordMatch) {
      return res.status(403).json({
        status: ErrorMessages.PASSWORD_INCORRECT
      })
    }

    //@ts-ignore
    const token = jwt.sign(potentialUser.toJSON(), process.env.JWT_SECRET, {
      expiresIn: '1d'
    })

    req.session.user = potentialUser
    req.session.authenticated = true

    res.send({
      user: {
        _id: potentialUser._id,
        userName: potentialUser.userName,
        name: potentialUser.name,
        email: potentialUser.email
      },
      isLoggedIn: true,
      token: token
    })
    res.status(204).end()
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error logging in'
    })
  }
}

export { handleLogin, attemptLogin }
