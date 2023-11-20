import { useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { UserProps, UserRoomEvents } from '../types'
import { ErrorMessages } from '../types/Errors'

const useRoomFeedback = ({
  socket,
  navigate,
  handleShowToast
}: {
  socket: Socket
  navigate: any
  handleShowToast: (text: string[]) => void
}) => {
  useEffect(() => {
    socket.on(
      'roomFeedback',
      (
        slug: string,
        state: UserRoomEvents,
        user: UserProps,
        document: {
          _id: string
          title: string
          slug: string
          filePath: string
        }
      ) => {
        switch (state) {
          case UserRoomEvents.ALREADY_JOINED:
            navigate(`/document/${slug}`)
            break
          case UserRoomEvents.JOINABLE:
            socket.emit(
              'roomJoin',
              user._id,
              user.userName,
              slug,
              (response: { isSuccess: boolean; message: ErrorMessages }) => {
                if (!response.isSuccess) {
                  handleShowToast(['Could not join room'])
                } else {
                  navigate(`/document/${slug}`)
                }
              }
            )
            break
          case UserRoomEvents.NON_EXISTENT:
            socket.emit(
              'roomCreate',
              user._id,
              user.userName,
              slug,
              document,
              (response: { isSuccess: boolean; message: ErrorMessages }) => {
                console.log('response = ', response)
                if (!response.isSuccess) {
                  handleShowToast(['Could not create room'])
                } else {
                  navigate(`/document/${slug}`)
                }
              }
            )
            break
          default:
            break
        }
      }
    )

    return () => {
      socket.off('roomFeedback')
    }
  }, [])
}

export default useRoomFeedback
