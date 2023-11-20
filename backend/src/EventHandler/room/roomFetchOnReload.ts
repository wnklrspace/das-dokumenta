import { RoomProps } from '../../types'
import { ErrorMessages } from '../../types/Errors'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'

const roomFetchOnReload = (
  { io, socket, rooms }: EventHandlerProps,
  ...[roomId, callback]: Parameters<ClientEvents['roomFetchOnReload']>
) => {
  try {
    const room = rooms[roomId.toLowerCase()]

    if (!room) {
      throw new Error(ErrorMessages.ROOM_NOT_FOUND)
    }

    const roomsArray: RoomProps[] = Object.values(rooms)
    const roomsObserverOverview = roomsArray.map((room: RoomProps) => {
      return {
        _id: room._id,
        users: room.users.map((user) => {
          return {
            name: user.name
          }
        })
      }
    })

    io.emit('roomsOverview', roomsObserverOverview)

    callback?.({
      isSuccess: true,
      room: room
    })
  } catch (message: any) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default roomFetchOnReload
