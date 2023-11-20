import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import Comment from '../../models/Comment'

const commentResolve = async (
  { io, rooms }: EventHandlerProps,
  ...[commentId, documentId, roomId, resolvedState, callback]: Parameters<
    ClientEvents['commentResolve']
  >
) => {
  try {
    const room = rooms[roomId.toLowerCase()]

    if (!room) {
      throw new Error(ErrorMessages.ROOM_NOT_FOUND)
    }

    await Comment.findOneAndUpdate(
      { _id: commentId },
      { resolved: resolvedState },
      { new: true }
    ).then((comment) => {
      if (!comment) {
        throw new Error(ErrorMessages.COMMENT_NOT_FOUND)
      }

      if (comment.resolved !== resolvedState) {
        throw new Error(ErrorMessages.COMMENT_STATE_NOT_UPDATED)
      }

      io.to(room._id).emit('commentChanged', comment)
    })

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

export default commentResolve
