import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import { UserProps } from '../../types'

const commentStateSetter = (
  { io, socket, rooms }: EventHandlerProps,
  ...[userId, roomId, mode, callback]: Parameters<ClientEvents['commentStateSetter']>
) => {
  try {
    const room = rooms[roomId]

    if (!room) {
      throw new Error(ErrorMessages.ROOM_NOT_FOUND)
    }

    const user = room.users.find((user: UserProps) => user._id === userId)
    const updatedUser = {
      ...user,
      mode: mode
    }

    // @ts-ignore
    room.users = room.users.map((user: UserProps) => {
      if (user._id === userId) {
        return updatedUser
      }
      return user
    })

    io.to(room._id).emit('roomChanged', room)

    callback?.({
      isSuccess: true
    })
  } catch (message) {
    console.log('error = ', message)
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default commentStateSetter
