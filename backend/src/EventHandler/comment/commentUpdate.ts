import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import Comment from '../../models/Comment'

const commentUpdate = async (
  { io, rooms, socket }: EventHandlerProps,
  ...[commentId, documentId, roomId, content, timesEdited, callback]: Parameters<
    ClientEvents['commentUpdate']
  >
) => {
  try {
    const room = rooms[roomId]

    if (!room) {
      throw new Error(ErrorMessages.ROOM_NOT_FOUND)
    }

    await Comment.findOneAndUpdate(
      { _id: commentId },
      { content: content, timesEdited: timesEdited },
      { new: true }
    ).then((comment) => {
      if (!comment) {
        throw new Error(ErrorMessages.COMMENT_NOT_FOUND)
      }

      io.to(room._id).emit('commentChanged', comment)
    })

    callback?.({
      isSuccess: true
    })
  } catch (message) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default commentUpdate
