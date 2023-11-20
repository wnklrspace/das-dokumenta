import { ErrorMessages } from '../../types/Errors'
import handleGetRoom from './handleGetRoom'
import handleGetUser from './handleGetUser'

function handleGetRoomAndUser(socket: any, rooms: any) {
  const roomId = Array.from(socket.rooms)[1]
  if (!roomId) throw new Error(ErrorMessages.USER_NOT_FOUND)

  const room = handleGetRoom(rooms, roomId.toString())
  const user = handleGetUser(room, socket.id)

  return { room, user }
}

export default handleGetRoomAndUser
