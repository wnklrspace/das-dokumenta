import { ErrorMessages } from '../../types/Errors'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'

const roomCheckForUser = (
  { io, socket, rooms }: EventHandlerProps,
  ...[roomId, callback]: Parameters<ClientEvents['roomCheckForUser']>
) => {
  try {
    const room = rooms[roomId.toLowerCase()]

    if (!room) {
      throw new Error(ErrorMessages.ROOM_NOT_FOUND)
    }

    callback?.({
      isSuccess: true,
      users: room.users
    })
  } catch (message: any) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default roomCheckForUser
