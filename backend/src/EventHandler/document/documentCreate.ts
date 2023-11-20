import { writeFile } from 'fs'
import Document from '../../models/Document'
import { slugify } from '../../helper/slugify'
import { ClientEvents, EventHandlerProps } from '../../types/EventHandlerMap'
import { ErrorMessages } from '../../types/Errors'

const documentCreate = async (
  { io }: EventHandlerProps,
  ...[userId, title, file, callback]: Parameters<ClientEvents['documentCreate']>
) => {
  try {
    const timeStamp = new Date()
    let slug = slugify(title)
    const filePathToBeWrittenTo = `./pdf-docs/${slug}.pdf`
    const filePath = `/pdf-docs/${slug}.pdf`
    const existingDocument = await Document.find({ slug })

    if (existingDocument.length > 0) {
      slug = slug + '-' + existingDocument.length
    }

    writeFile(filePathToBeWrittenTo, file, (err) => {
      if (err) {
        throw new Error(ErrorMessages.DOCUMENT_CREATE_FAILED)
      }
    })

    await Document.create({
      title,
      slug,
      createdAt: timeStamp,
      filePath: filePath,
      createdBy: userId,
      comments: [],
      availableTo: [userId]
    })
      .then((document) => {
        io.emit('documentCreated', document)
      })
      .catch((err) => {
        console.log('document could not be created. Err: ', err)
        throw new Error(ErrorMessages.DOCUMENT_CREATE_FAILED)
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

export default documentCreate
