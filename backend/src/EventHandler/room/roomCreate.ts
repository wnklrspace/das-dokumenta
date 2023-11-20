import handleCreateRoom from '../../helper/room/handleCreateRoom'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import { RoomProps, UserModes } from '../../types'

const roomCreate = async (
  { io, socket, rooms }: EventHandlerProps,
  ...[userId, userName, roomName, document, callback]: Parameters<ClientEvents['roomCreate']>
) => {
  try {
    if (socket.rooms.size > 1) {
      throw new Error(ErrorMessages.USER_ALREADY_IN_A_ROOM)
    }
    const user = {
      _id: userId,
      name: userName,
      userName: userName,
      socketId: socket.id,
      mode: UserModes.DEFAULT,
      cursorProps: {
        x: 0,
        y: 0,
        opacity: 0
      }
    }

    const room = handleCreateRoom(rooms, roomName, user, document)
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
    socket.join(room._id)
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

export default roomCreate
