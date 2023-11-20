import { RoomProps } from '../../types'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import handleGetRoomAndUser from '../../helper/room/handleGetRoomAndUser'
import handleRemoveUser from '../../helper/room/handleRemoveUser'

const roomLeave = async (
  { io, socket, rooms }: EventHandlerProps,
  ...[callback]: Parameters<ClientEvents['roomLeave']>
) => {
  try {
    const { user, room } = handleGetRoomAndUser(socket, rooms)

    handleRemoveUser(room, user.socketId)
    socket.leave(room._id)

    setTimeout(function () {
      if (room.users.length === 0) {
        delete rooms[room._id]
        console.log('Room deleted')
      }
    }, 1000)

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

export default roomLeave
