import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CommentProps, UserModes } from '../types'
import { useRoom, useSocket } from './SocketProvider'

type DocumentContextProps = {
  sidebar: boolean
  setSidebar: React.Dispatch<React.SetStateAction<boolean>>
  showResolved: boolean
  setShowResolved: React.Dispatch<React.SetStateAction<boolean>>
  userMode: UserModes
  setUserMode: React.Dispatch<React.SetStateAction<UserModes>>
  comments: CommentProps[]
  setComments: React.Dispatch<React.SetStateAction<CommentProps[]>>
  commentDraft: CommentProps | undefined
  setCommentDraft: React.Dispatch<React.SetStateAction<CommentProps | undefined>>
  documentLoad: { commentsLoaded: boolean; pdfLoaded: boolean }
  setDocumentLoad: React.Dispatch<
    React.SetStateAction<{
      commentsLoaded: boolean
      pdfLoaded: boolean
    }>
  >
  fullCommentRefs: CommentRefProps[]
  setFullCommentRefs: React.Dispatch<React.SetStateAction<CommentRefProps[]>>
  pinCommentRefs: CommentRefProps[]
  setPinCommentRefs: React.Dispatch<React.SetStateAction<CommentRefProps[]>>
  pdfWrapperRef: React.RefObject<HTMLDivElement>
  pdfCanvasRef: React.RefObject<HTMLDivElement>
  sidebarContainerRef: React.RefObject<HTMLDivElement>
}

export const DocumentContext = createContext<DocumentContextProps | undefined>(undefined)

type DocumentProviderProps = {
  children: React.ReactNode
}

const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const socket = useSocket()
  const { room } = useRoom()
  const [documentLoad, setDocumentLoad] = useState<{ commentsLoaded: boolean; pdfLoaded: boolean }>(
    {
      commentsLoaded: false,
      pdfLoaded: false
    }
  )
  const [sidebar, setSidebar] = useState<boolean>(true)
  const [showResolved, setShowResolved] = useState<boolean>(false)
  const [userMode, setUserMode] = useState<UserModes>(UserModes.DEFAULT)
  const [comments, setComments] = useState<CommentProps[]>([])
  const [commentDraft, setCommentDraft] = useState<CommentProps>()
  const [fullCommentRefs, setFullCommentRefs] = useState<CommentRefProps[]>([])
  const [pinCommentRefs, setPinCommentRefs] = useState<CommentRefProps[]>([])
  const pdfWrapperRef = useRef<HTMLDivElement>(null)
  const pdfCanvasRef = useRef<HTMLDivElement>(null)

  const sidebarContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    socket.emit('commentsFetch', room?.document?._id)
  }, [room, socket])

  useEffect(() => {
    socket.on('commentChanged', (comment: CommentProps) => {
      if (!comment) {
        return
      }
      setComments((prevComments) => {
        const newComments = [...prevComments]
        const index = newComments.findIndex((a) => a._id === comment._id)
        if (index === -1) {
          newComments.push(comment)
        } else {
          newComments[index] = comment
        }
        return newComments
      })
    })

    return () => {
      socket.off('commentChanged')
    }
  }, [])

  useEffect(() => {
    socket.on('availableComments', (comments: CommentProps[]) => {
      if (comments) {
        setComments([...comments])
        setDocumentLoad((prev) => ({ ...prev, commentsLoaded: true }))
      }
    })

    return () => {
      socket.off('availableComments')
    }
  }, [])

  const memorizedValue = useMemo(
    () => ({
      sidebar,
      setSidebar,
      showResolved,
      setShowResolved,
      userMode,
      setUserMode,
      comments,
      setComments,
      commentDraft,
      setCommentDraft,
      documentLoad,
      setDocumentLoad,
      fullCommentRefs,
      setFullCommentRefs,
      pinCommentRefs,
      setPinCommentRefs,
      pdfWrapperRef,
      pdfCanvasRef,
      sidebarContainerRef
    }),
    [
      sidebar,
      setSidebar,
      showResolved,
      setShowResolved,
      userMode,
      setUserMode,
      comments,
      setComments,
      commentDraft,
      setCommentDraft,
      documentLoad,
      setDocumentLoad,
      fullCommentRefs,
      setFullCommentRefs,
      pinCommentRefs,
      setPinCommentRefs,
      pdfWrapperRef,
      pdfCanvasRef,
      sidebarContainerRef
    ]
  )

  return <DocumentContext.Provider value={memorizedValue}>{children}</DocumentContext.Provider>
}

export default DocumentProvider

export const useSidebar = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a DocumentProvider')
  }
  return {
    sidebar: context.sidebar,
    setSidebar: context.setSidebar,
    showResolved: context.showResolved,
    setShowResolved: context.setShowResolved
  }
}

export const useUserMode = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useUserMode must be used within a DocumentProvider')
  }
  return {
    userMode: context.userMode,
    setUserMode: context.setUserMode
  }
}

export const useComments = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useComments must be used within a DocumentProvider')
  }
  return {
    comments: context.comments,
    setComments: context.setComments
  }
}

export const useCommentDraft = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useCommentDraft must be used within a DocumentProvider')
  }
  return {
    commentDraft: context.commentDraft,
    setCommentDraft: context.setCommentDraft
  }
}

export const useDocumentLoader = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocumentLoad must be used within a DocumentProvider')
  }
  return {
    documentLoad: context.documentLoad,
    setDocumentLoad: context.setDocumentLoad
  }
}

export const useCommentRefs = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useCommentRefs must be used within a DocumentProvider')
  }

  return {
    fullCommentRefs: context.fullCommentRefs,
    setFullCommentRefs: context.setFullCommentRefs,
    pinCommentRefs: context.pinCommentRefs,
    setPinCommentsRefs: context.setPinCommentRefs
  }
}

export const useScrollContainerRefs = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('scrollContainerRefs must be used within a DocumentProvider')
  }

  return {
    pdfWrapperRef: context.pdfWrapperRef,
    pdfCanvasRef: context.pdfCanvasRef,
    sidebarContainerRef: context.sidebarContainerRef
  }
}

export type CommentRefProps = {
  _id: string
  ref: HTMLDivElement
}
