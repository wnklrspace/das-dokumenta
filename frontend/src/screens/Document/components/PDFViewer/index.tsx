import { FC, MouseEvent, useEffect, useState } from 'react'
import { Loading } from '@geist-ui/core'
import styled from 'styled-components'
import { Document, Page, pdfjs } from 'react-pdf'
import { CommentProps, UserModes } from '../../../../types'
import { useUser } from '../../../../store/UserProvider'
import { useRoom, useSocket } from '../../../../store/SocketProvider'
import {
  useCommentDraft,
  useComments,
  useDocumentLoader,
  useScrollContainerRefs,
  useSidebar,
  useUserMode
} from '../../../../store/DocumentProvider'
import MobileComment from '../Comment/MobileComment'
import Comment from '../Comment/CommentPin'
import useWindowSize from '../../../../hooks/useWindowSize'
import { useModal } from '../../../../store/ModalProvider'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

const PDFViewer: FC = () => {
  const socket = useSocket()
  const [file] = useState('/report.pdf')
  const [numPages, setNumPages] = useState<number>(0)
  const { documentLoad, setDocumentLoad } = useDocumentLoader()
  const { width } = useWindowSize()
  const { showMobileComment, setShowMobileComment, setModalContent } = useModal()
  const { commentDraft, setCommentDraft } = useCommentDraft()
  const { comments } = useComments()
  const { setSidebar, setShowResolved } = useSidebar()
  const { pdfCanvasRef } = useScrollContainerRefs()
  const { userMode, setUserMode } = useUserMode()
  const { user } = useUser()
  const { room } = useRoom()

  function getClickPosition(event: MouseEvent) {
    const currentElement = pdfCanvasRef.current
    const rect = currentElement!.getBoundingClientRect()

    let offsetX = window.scrollX + rect.left
    let offsetY = window.scrollY + rect.top
    let canvasX = event.pageX - offsetX
    let canvasY = event.pageY - offsetY

    //This divider is being used to eliminate the height/width of the scrollbar in the calculation
    const leftPercent = (canvasX * 100) / currentElement!.children[0].getBoundingClientRect().width
    const topPercent = (canvasY * 100) / currentElement!.children[0].getBoundingClientRect().height

    return {
      leftPercent,
      topPercent
    }
  }

  function createCommentDraft(event: MouseEvent) {
    const commentId = 'draft'
    const { leftPercent, topPercent } = getClickPosition(event)
    socket.emit('commentStateSetter', user?._id, room?._id, UserModes.CREATION)

    const draft = {
      _id: commentId,
      left: leftPercent,
      top: topPercent,
      resolved: false,
      timesEdited: 0,
      className: leftPercent < 50 ? 'left' : 'right',
      content: '',
      createdAt: new Date(),
      createdBy: user?._id ? user?._id : '',
      document: room?.document?._id ? room?.document?._id : ''
    }

    if (width > 768) {
      setShowResolved(false)
      setCommentDraft(draft)
    } else {
      setModalContent({
        mode: 'create',
        comment: draft
      })
      setShowMobileComment(true)
    }
  }

  function cancelCommentCreation() {
    socket.emit('commentStateSetter', user?._id, room?._id, UserModes.DEFAULT)
    setCommentDraft(undefined)
  }

  function handleDocumentClick(event: MouseEvent) {
    if (userMode === UserModes.CREATION) {
      setUserMode(UserModes.DEFAULT)
      cancelCommentCreation()
    }

    if (userMode === UserModes.DEFAULT) {
      setUserMode(UserModes.CREATION)
      setSidebar(true)
      createCommentDraft(event)
    }
  }

  useEffect(() => {
    if (!showMobileComment) {
      setCommentDraft(undefined)
      socket.emit('commentStateSetter', user?._id, room?._id, UserModes.DEFAULT)
    }
  }, [showMobileComment, setShowMobileComment])

  return (
    <>
      <Container id="inner-document-wrapper" onClick={handleDocumentClick} ref={pdfCanvasRef}>
        {(!documentLoad.pdfLoaded || !documentLoad.commentsLoaded) && (
          <LoadingBubble>
            <Loading />
          </LoadingBubble>
        )}
        <Document
          className={
            documentLoad.pdfLoaded && documentLoad.commentsLoaded ? 'pdf-loaded' : 'pdf-loading'
          }
          file={room?.document?.filePath ? room?.document.filePath : file}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages)
          }}
          onLoadError={console.error}
        >
          <>
            {Array.apply(null, Array(numPages))
              .map((x, i) => i + 1)
              .map((page) => (
                <Page
                  key={`page_${page}`}
                  pageNumber={page}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  onLoadSuccess={(page) => {
                    if (page.pageNumber === numPages) {
                      setDocumentLoad({ ...documentLoad, pdfLoaded: true })
                    }
                  }}
                />
              ))}

            {commentDraft && (
              <Comment
                key={commentDraft._id}
                _id={commentDraft._id}
                left={commentDraft.left}
                top={commentDraft.top}
                resolved={commentDraft.resolved}
                timesEdited={commentDraft.timesEdited}
                className={commentDraft.className}
                content={commentDraft.content}
                createdAt={commentDraft.createdAt}
                createdBy={commentDraft.createdBy}
                document={commentDraft.document}
              />
            )}

            {comments &&
              comments.map(function (comment: CommentProps, index: number) {
                if (width > 768) {
                  return (
                    <Comment
                      key={comment._id + index}
                      _id={comment._id}
                      resolved={comment.resolved}
                      timesEdited={comment.timesEdited}
                      left={comment.left}
                      top={comment.top}
                      className={comment.className}
                      content={comment.content}
                      createdAt={comment.createdAt}
                      createdBy={comment.createdBy}
                      document={comment.document}
                    />
                  )
                } else {
                  return (
                    <MobileComment
                      key={comment._id + index}
                      _id={comment._id}
                      resolved={comment.resolved}
                      timesEdited={comment.timesEdited}
                      left={comment.left}
                      top={comment.top}
                      className={comment.className}
                      content={comment.content}
                      createdAt={comment.createdAt}
                      createdBy={comment.createdBy}
                      document={comment.document}
                    />
                  )
                }
              })}
          </>
        </Document>
      </Container>
    </>
  )
}

const Container = styled.div`
  margin: auto;
  cursor: none !important;
  position: relative;

  .react-pdf__Page__canvas {
    width: 100% !important;
    height: auto !important;
    box-shadow: 0 4px 17px rgba(0, 0, 0, 0.15);
  }

  .react-pdf__Document {
    gap: 2vh;
    display: flex !important;
    flex-direction: column;
    position: relative;
  }

  .pdf-loaded {
    opacity: 1;
  }

  .pdf-loading {
    opacity: 0;
  }
`

const LoadingBubble = styled.div`
  position: absolute;
  top: -1.6rem;
  right: -1.6rem;
  width: 3.2rem;
  height: 1.8rem;
  border-radius: 1rem;
  background-color: #fefefe;
  border: 1px solid #eaeaea;
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

  i {
    height: 0.5rem !important;
    width: 0.5rem !important;
  }
`

export default PDFViewer
