import { UserProps, UserRoomEvents } from '../../types'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'

const roomCheck = (
  { io, socket, rooms }: EventHandlerProps,
  ...[roomId, user, document, callback]: Parameters<ClientEvents['roomCheck']>
) => {
  try {
    let state: UserRoomEvents
    const room = rooms[roomId.toLowerCase()]

    if (room) {
      if (room.users.some((user: UserProps) => user.socketId === socket.id)) {
        state = UserRoomEvents.ALREADY_JOINED
      } else {
        state = UserRoomEvents.JOINABLE
      }
    } else {
      state = UserRoomEvents.NON_EXISTENT
    }

    const returnedDocument = {
      _id: document._id,
      title: document.title,
      slug: document.slug,
      filePath: document.filePath
    }

    socket.emit('roomFeedback', roomId, state, user, returnedDocument)

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

export default roomCheck
