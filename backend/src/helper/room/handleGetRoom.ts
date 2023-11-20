import { RoomProps, RoomsProps } from '../../types'
import { ErrorMessages } from '../../types/Errors'

function handleGetRoom(rooms: RoomsProps, roomId: string): RoomProps {
  const room = rooms[roomId.toLowerCase()]

  if (!room) {
    throw new Error(ErrorMessages.ROOM_NOT_FOUND)
  }
  return room
}

export default handleGetRoom
