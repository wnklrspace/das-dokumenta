import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import { RoomProps, UserModes } from '../../types'
import getRoom from '../../helper/room/handleGetRoom'
import handleIsUserInRoom from '../../helper/room/handleIsUserInRoom'

const roomJoin = async (
  { io, socket, rooms }: EventHandlerProps,
  ...[userId, userName, roomName, callback]: Parameters<ClientEvents['roomJoin']>
) => {
  try {
    if (socket.rooms.size > 1) {
      throw new Error(ErrorMessages.USER_ALREADY_IN_A_ROOM)
    }
    const room: RoomProps = getRoom(rooms, roomName)
    const userIsInRoom: boolean = handleIsUserInRoom(room, socket.id)

    if (userIsInRoom) {
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

    room.users.push(user)

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

export default roomJoin
