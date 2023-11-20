import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import Comment from '../../models/Comment'

const commentsFetch = async (
  { rooms, socket }: EventHandlerProps,
  ...[documentId, callback]: Parameters<ClientEvents['commentsFetch']>
) => {
  try {
    const comments = await Comment.find({ document: documentId })

    if (!comments) {
      throw new Error(ErrorMessages.COMMENTS_NOT_FOUND)
    }

    socket.emit(
      'availableComments',
      comments.sort((a, b) => {
        return a === b ? 0 : a ? -1 : 1
      })
    )

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

export default commentsFetch
