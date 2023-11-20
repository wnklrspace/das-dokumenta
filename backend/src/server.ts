import { Server } from 'socket.io'
import { Application } from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import express from 'express'

import { RoomsProps } from './types'
import { ClientEvents, ServerEvents } from './types/EventHandlerMap'
import { corsConfig, sessionMiddleware, wrapper } from './Controller/serverController'
import { authorizeUser } from './Controller/socketController'
import connectDB from './database'
import EventHandler from './EventHandler'
import authRouter from './routers/authRouter'

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any }
    decoded: { [key: string]: any }
    authenticated: boolean
  }
}

dotenv.config()
connectDB()

const rooms: RoomsProps = {}
const app: Application = express()
const server = createServer(app)

const io: Server<ClientEvents, ServerEvents> = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: corsConfig
})

app.use(helmet())
app.use(cors(corsConfig))
app.use(express.json())
app.use(cookieParser())

app.use(sessionMiddleware)
app.use('/auth', authRouter)
app.set('trust proxy', 1)

io.use(wrapper(sessionMiddleware))
io.use(authorizeUser)
io.on('connection', (socket) => {
  console.log('Socket connected: ' + socket.id)

  socket.on('userFetch', (...params) => {
    EventHandler.userFetch(...params)
  })

  socket.on('documentCreate', (...params) => {
    EventHandler.documentCreate({ io, socket, rooms }, ...params)
  })

  socket.on('documentsFetch', (...params) => {
    EventHandler.documentsFetch({ io, socket, rooms }, ...params)
  })

  socket.on('roomCreate', (...params) => {
    EventHandler.roomCreate({ io, socket, rooms }, ...params)
  })

  socket.on('roomJoin', (...params) => {
    EventHandler.roomJoin({ io, socket, rooms }, ...params)
  })

  socket.on('roomLeave', (...params) => {
    EventHandler.roomLeave({ io, socket, rooms }, ...params)
  })

  socket.on('roomFetchOnReload', (...params) => {
    EventHandler.roomFetchOnReload({ io, socket, rooms }, ...params)
  })

  socket.on('roomCheck', (...params) => {
    EventHandler.roomCheck({ io, socket, rooms }, ...params)
  })

  socket.on('roomCheckForUser', (...params) => {
    EventHandler.roomCheckForUser({ io, socket, rooms }, ...params)
  })

  socket.on('roomCheckForComments', (...params) => {
    EventHandler.roomCheckForComments({ io, socket, rooms }, ...params)
  })

  socket.on('roomOverviewLoad', (...params) => {
    EventHandler.roomOverviewLoad({ io, socket, rooms }, ...params)
  })

  socket.on('updateCursor', (...params) => {
    EventHandler.updateCursor({ io, socket, rooms }, ...params)
  })

  socket.on('commentCreate', (...params) => {
    EventHandler.commentCreate({ io, socket, rooms }, ...params)
  })

  socket.on('commentUpdate', (...params) => {
    EventHandler.commentUpdate({ io, socket, rooms }, ...params)
  })

  socket.on('commentResolve', (...params) => {
    EventHandler.commentResolve({ io, socket, rooms }, ...params)
  })

  socket.on('commentStateSetter', (...params) => {
    EventHandler.commentStateSetter({ io, socket, rooms }, ...params)
  })

  socket.on('commentsFetch', (...params) => {
    EventHandler.commentsFetch({ io, socket, rooms }, ...params)
  })

  socket.on('commentsChanged', (...params) => {
    EventHandler.commentsChanged({ io, socket, rooms }, ...params)
  })

  socket.on('error', (error: any) => {
    console.log(error)
  })
})

app.use('/pdf-docs', express.static('pdf-docs'))

app.get('/', (req, res) => {
  res.send('API is running..')
})

export default server
