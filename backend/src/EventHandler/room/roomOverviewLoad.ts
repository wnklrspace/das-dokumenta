import { RoomProps } from '../../types'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'

const roomOverviewLoad = async (
  { io, rooms }: EventHandlerProps,
  ...[roomId, callback]: Parameters<ClientEvents['roomFetchOnReload']>
) => {
  try {
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
      isSuccess: true
    })
  } catch (message: any) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default roomOverviewLoad
