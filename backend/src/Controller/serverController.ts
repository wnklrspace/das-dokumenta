import session from 'express-session'
import dotenv from 'dotenv'
import { Socket } from 'socket.io'
import { ClientEvents, ServerEvents } from '../types/EventHandlerMap'
import { MongoUri } from '../database'

const MongoDBStore = require('connect-mongodb-session')(session)

dotenv.config()
const serverUrl = process.env.IP_ADDRESS || 'localhost'

const store = new MongoDBStore({
  uri: MongoUri,
  collection: 'sessions'
})

const sessionMiddleware = session({
  secret: 'my secret',
  saveUninitialized: false,
  resave: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '0')
  },
  store: store
})

const wrapper = (middleware: any) => (socket: Socket<ClientEvents, ServerEvents>, next: unknown) =>
  middleware(socket.request, {}, next)

const corsConfig = {
  origin: `http://${serverUrl}:${process.env.FRONTEND_PORT || 3000}`,
  credentials: true
}

export { sessionMiddleware, wrapper, corsConfig }
