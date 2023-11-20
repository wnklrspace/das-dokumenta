import { useEffect } from 'react'
import { RoomProps, UserProps } from '../types'
import { ErrorMessages } from '../types/Errors'
import checkData from '../helper/checkData'

export const useApplicationReload = ({
  socket,
  slug,
  href,
  user,
  setUser,
  room,
  setRoom,
  roomWasUpdated,
  setRoomWasUpdated,
  navigate
}: {
  socket: any
  slug: string | undefined
  href: string
  user: UserProps | undefined
  setUser: (user: UserProps | undefined) => void
  room: RoomProps | undefined
  setRoom: (room: RoomProps | undefined) => void
  roomWasUpdated: boolean
  setRoomWasUpdated: (roomWasUpdated: boolean) => void
  navigate: (path: string) => void
}) => {
  // handle reloading the application
  useEffect(() => {
    if (!room) {
      socket.emit(
        'roomFetchOnReload',
        slug,
        (response: { isSuccess: boolean; room: RoomProps }) => {
          if (!response.isSuccess) {
            navigate('/app')
          } else {
            setRoom(response.room)
            setRoomWasUpdated(true)
          }
        }
      )
    }

    if (!user) {
      const data: UserProps = JSON.parse(localStorage.getItem('user') || '{}')
      const dataIsValid: boolean = checkData(data)
      let userIsSaved: boolean = false

      if (!user) {
        if (dataIsValid) {
          setUser(data)
          userIsSaved = true

          if (!href.includes('/document/') && !userIsSaved) {
            navigate('/app')
          }
        } else {
          navigate('/login')
        }
      }
    }
  }, [])

  useEffect(() => {
    let UserAlreadyInRoom: boolean = false

    if (room && room.users.find((user: UserProps) => user.socketId === socket.id)) {
      UserAlreadyInRoom = true
    }

    if (!UserAlreadyInRoom && room && user) {
      socket.emit('roomJoin', user._id, user.userName, room._id)
    }
  }, [roomWasUpdated, setRoomWasUpdated])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.stopImmediatePropagation()
      socket.emit('roomLeave', (response: { isSuccess: boolean; message: ErrorMessages }) => {
        if (!response.isSuccess) {
          console.log(response.message, 'could not be left')
        }
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}
