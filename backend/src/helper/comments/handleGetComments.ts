import Comment from '../../models/Comment'
import { CommentProps, DocumentProps } from '../../types'
import { ErrorMessages } from '../../types/Errors'

async function handleGetComments(documentId: DocumentProps['_id']): Promise<CommentProps[]> {
  const comments: CommentProps[] = await Comment.find({ document: documentId })

  if (!comments) {
    throw new Error(ErrorMessages.COMMENTS_NOT_FOUND)
  }

  return comments
}

export default handleGetComments
