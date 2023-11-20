import Document from '../../models/Document'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'

const documentsFetch = async (
  { socket }: EventHandlerProps,
  ...[userId, callback]: Parameters<ClientEvents['documentsFetch']>
) => {
  try {
    const documents = await Document.find()
    socket.emit('availableDocuments', documents)

    callback?.({
      isSuccess: true
    })
  } catch (message) {
    callback?.({
      isSuccess: false,
      message: ErrorMessages.DOCUMENTS_NOT_FOUND
    })
  }
}

export default documentsFetch
