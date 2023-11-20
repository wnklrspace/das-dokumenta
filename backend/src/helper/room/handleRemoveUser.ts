import { RoomProps, UserProps } from '../../types'
import { ErrorMessages } from '../../types/Errors'

function handleRemoveUser(room: RoomProps, socketId: string): boolean {
  const userIndex = room.users.findIndex((user: UserProps) => user.socketId === socketId)

  if (userIndex === -1) {
    throw new Error(ErrorMessages.USER_NOT_FOUND)
  }

  room.users.splice(userIndex, 1)
  return true
}

export default handleRemoveUser
