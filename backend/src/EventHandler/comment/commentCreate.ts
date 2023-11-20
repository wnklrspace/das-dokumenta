import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import Comment from '../../models/Comment'
import Document from '../../models/Document'
import User from '../../models/User'
import { ErrorMessages } from '../../types/Errors'

const commentCreate = async (
  { io, rooms }: EventHandlerProps,
  ...[left, top, className, content, createdBy, documentId, roomId, callback]: Parameters<
    ClientEvents['commentCreate']
  >
) => {
  try {
    const room = rooms[roomId.toLowerCase()]
    const resolved: boolean = false
    const timeStamp = new Date()

    const comment = {
      resolved,
      timesEdited: 0,
      left,
      top,
      className,
      content,
      createdAt: timeStamp,
      createdBy,
      document: documentId
    }

    const createdComment = await Comment.create(comment)

    await Document.updateOne(
      { _id: documentId },
      {
        $push: {
          comments: createdComment
        }
      }
    )

    await User.updateOne(
      { _id: createdBy },
      {
        $push: {
          comments: createdComment
        }
      }
    )

    if (!room) {
      throw new Error(ErrorMessages.ROOM_NOT_FOUND)
    }

    io.to(room._id).emit('commentChanged', createdComment)

    callback?.({
      isSuccess: true
    })
  } catch (message) {
    console.log('error = ', message)
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default commentCreate
