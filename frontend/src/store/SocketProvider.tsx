import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { RoomProps, RoomsObserverProps } from '../types'
import { useToken } from './UserProvider'
import socketConnect from './helper/socketConnection'

type SocketContextProps = {
  socket: any
  socketIsConnected: boolean
  setSocketIsConnected: React.Dispatch<React.SetStateAction<boolean>>
  room: RoomProps | undefined
  setRoom: React.Dispatch<React.SetStateAction<RoomProps | undefined>>
  roomsObserver: RoomsObserverProps[]
  setRoomsObserver: React.Dispatch<React.SetStateAction<RoomsObserverProps[]>>
}

export const SocketContext = createContext<SocketContextProps | undefined>(undefined)

type SocketProviderProps = {
  children: React.ReactNode
}

const SocketProvider = ({ children }: SocketProviderProps) => {
  const { token, setToken } = useToken()
  const socket = useMemo(() => socketConnect(token), [token, setToken])
  const [socketIsConnected, setSocketIsConnected] = useState<boolean>(false)
  const [room, setRoom] = useState<RoomProps | undefined>(undefined)
  const [roomsObserver, setRoomsObserver] = useState<RoomsObserverProps[]>([
    {
      _id: '',
      users: []
    }
  ])

  useEffect(() => {
    socket.connect()

    function onConnection() {
      setSocketIsConnected(true)
    }

    function onDisconnection() {
      setSocketIsConnected(false)
    }

    socket.on('connect', onConnection)
    socket.on('disconnect', onDisconnection)

    return () => {
      socket.disconnect()
      socket.off('connect', onConnection)
      socket.off('disconnect', onDisconnection)
    }
  }, [token, setToken])

  useEffect(() => {
    socket.emit('roomOverviewLoad')
  }, [socketIsConnected])

  useEffect(() => {
    socket.on('roomsOverview', (rooms: RoomsObserverProps[]) => {
      setRoomsObserver(rooms)
    })

    socket.on('roomChanged', (room: RoomProps | undefined) => {
      setRoom(room)
    })

    return () => {
      socket.off('roomUsersChanged')
      socket.off('roomChanged')
    }
  }, [socketIsConnected])

  useEffect(() => {
    const reloadPage = setTimeout(() => {
      if (!socketIsConnected) {
        window.location.reload()
      }
    }, 5000)

    return () => {
      clearTimeout(reloadPage)
    }
  }, [socketIsConnected])

  const memorizedValue = useMemo(
    () => ({
      socket,
      socketIsConnected,
      setSocketIsConnected,
      room,
      setRoom,
      roomsObserver,
      setRoomsObserver
    }),
    [
      socket,
      room,
      setRoom,
      socketIsConnected,
      setSocketIsConnected,
      roomsObserver,
      setRoomsObserver
    ]
  )

  return <SocketContext.Provider value={memorizedValue}>{children}</SocketContext.Provider>
}

export default SocketProvider

export const useSocketConnection = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context.socketIsConnected
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context.socket
}

export const useRoom = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return {
    room: context.room,
    setRoom: context.setRoom,
    roomsObserver: context.roomsObserver,
    setRoomsObserver: context.setRoomsObserver
  }
}
