import { RoomProps, RoomsProps, UserProps } from '../../types'

function handleCreateRoom(
  rooms: RoomsProps,
  roomId: string,
  user: UserProps,
  document: {
    _id: string
    title: string
    slug: string
    filePath: string
  }
): RoomProps {
  const room = {
    _id: roomId.toLowerCase(),
    host: {
      _id: user._id,
      socketId: user.socketId,
      userName: user.userName
    },
    createdBy: user.socketId,
    users: [user],
    createdAt: new Date(),
    document: {
      _id: document._id,
      title: document.title,
      slug: document.slug,
      filePath: `http://${process.env.IP_ADDRESS}:${process.env.BACKEND_PORT}` + document.filePath
    }
  }

  rooms[roomId.toLowerCase()] = room
  return room
}

export default handleCreateRoom
