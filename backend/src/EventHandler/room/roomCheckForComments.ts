import { ErrorMessages } from '../../types/Errors'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import Comment from '../../models/Comment'

const roomCheckForComments = async (
  { io, socket, rooms }: EventHandlerProps,
  ...[documentId, callback]: Parameters<ClientEvents['roomCheckForComments']>
) => {
  try {
    const comments = await Comment.find({ document: documentId })

    if (!comments) {
      throw new Error(ErrorMessages.COMMENTS_NOT_FOUND)
    }

    const availableComments = comments.filter((comment) => {
      comment.resolved === true
    })

    callback?.({
      isSuccess: true,
      availableComments: availableComments.length > 0 ? availableComments : []
    })
  } catch (message: any) {
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default roomCheckForComments
