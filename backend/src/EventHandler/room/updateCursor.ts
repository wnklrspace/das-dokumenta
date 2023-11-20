import { UserProps } from '../../types'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'

const updateCursor = (
  { io, socket, rooms }: EventHandlerProps,
  ...[roomId, userId, cursorProps, callback]: Parameters<ClientEvents['updateCursor']>
) => {
  try {
    const room = rooms[roomId.toLowerCase()]

    room.users.map((user: UserProps) => {
      if (user.socketId === socket.id) {
        user.cursorProps.x = cursorProps.x
        user.cursorProps.y = cursorProps.y
        user.cursorProps.opacity = cursorProps.opacity
      }
    })

    io.to(room._id).emit('roomChanged', room)

    callback?.({
      isSuccess: true
    })
  } catch (message: any) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default updateCursor
