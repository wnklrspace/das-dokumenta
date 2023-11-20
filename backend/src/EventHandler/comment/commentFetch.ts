import { ClientEvents } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'
import Comment from '../../models/Comment'

const commentFetch = async (...[commentId, callback]: Parameters<ClientEvents['commentFetch']>) => {
  try {
    const comment = await Comment.find({ _id: commentId })

    if (!comment) {
      throw new Error(ErrorMessages.COMMENT_NOT_FOUND)
    }

    callback?.({
      isSuccess: true,
      comment: comment
    })
  } catch (message) {
    console.log('error = ', message)
    callback?.({
      isSuccess: false,
      message: message
    })
  }
}

export default commentFetch
