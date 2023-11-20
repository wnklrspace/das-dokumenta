import React, { createContext, useContext, useMemo, useState } from 'react'
import { CommentProps } from '../types'

type ModalContextProps = {
  showMobileComment: boolean
  setShowMobileComment: React.Dispatch<React.SetStateAction<boolean>>
  modalContent: {
    mode: 'create' | 'edit' | 'default'
    comment: CommentProps | null
  }
  setModalContent: React.Dispatch<
    React.SetStateAction<{
      mode: 'create' | 'edit' | 'default'
      comment: CommentProps | null
    }>
  >
}

export const ModalContext = createContext<ModalContextProps | undefined>(undefined)

type ModalProviderProps = {
  children: React.ReactNode
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [showMobileComment, setShowMobileComment] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<{
    mode: 'create' | 'edit' | 'default'
    comment: CommentProps | null
  }>({
    mode: 'default',
    comment: null
  })

  const memorizedValue = useMemo(
    () => ({
      showMobileComment,
      setShowMobileComment,
      modalContent,
      setModalContent
    }),
    [showMobileComment, setShowMobileComment, modalContent, setModalContent]
  )

  return <ModalContext.Provider value={memorizedValue}>{children}</ModalContext.Provider>
}

export default ModalProvider

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return {
    showMobileComment: context.showMobileComment,
    setShowMobileComment: context.setShowMobileComment,
    modalContent: context.modalContent,
    setModalContent: context.setModalContent
  }
}
