import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import X from '@geist-ui/icons/x'
import { CheckCircle, Edit } from '@geist-ui/icons'
import { useModal } from '../../../../../store/ModalProvider'
import { useUser } from '../../../../../store/UserProvider'
import { useRoom, useSocket } from '../../../../../store/SocketProvider'
import { useUserMode } from '../../../../../store/DocumentProvider'
import { UserModes } from '../../../../../types'
import { colors } from '../../../../../theme'

const Modal: FC = () => {
  const socket = useSocket()
  const { user } = useUser()
  const { room } = useRoom()
  const { setUserMode } = useUserMode()
  const { showMobileComment, modalContent, setModalContent, setShowMobileComment } = useModal()
  const [newContent, setNewContent] = useState<string>(modalContent.comment?.content || '')
  const [userFromComment, setUserFromComment] = useState<{ name: string; userName: string }>({
    name: '',
    userName: ''
  })
  const [readOnly, setReadOnly] = useState(true)
  const editButton = useRef<HTMLButtonElement>(null)
  const textArea = useRef<HTMLTextAreaElement>(null)

  function closeModal() {
    setShowMobileComment(false)

    setNewContent('')
    setModalContent({
      mode: 'default',
      comment: null
    })

    setUserMode(UserModes.DEFAULT)
    setReadOnly(true)
    socket.emit('commentStateSetter', user?._id, room?._id, UserModes.DEFAULT)
  }

  function saveComment(e: React.MouseEvent<HTMLButtonElement>) {
    if (!modalContent.comment) return

    if (modalContent.mode === 'edit') {
      socket.emit(
        'commentUpdate',
        modalContent.comment._id,
        room?.document?._id,
        room?._id,
        newContent,
        modalContent.comment.timesEdited + 1,
        (response: { isSuccess: boolean }) => {
          if (response.isSuccess) {
            // setUserMode(UserModes.DEFAULT)
            socket.emit('commentStateSetter', user?._id, room?._id, UserModes.DEFAULT)
          }
        }
      )

      setModalContent({
        mode: 'default',
        comment: {
          _id: modalContent.comment._id,
          content: newContent,
          resolved: modalContent.comment.resolved,
          createdBy: modalContent.comment.createdBy,
          timesEdited: modalContent.comment.timesEdited + 1,
          left: modalContent.comment.left,
          top: modalContent.comment.top,
          createdAt: modalContent.comment.createdAt,
          className: modalContent.comment.className,
          document: room!.document!._id
        }
      })
    } else {
      socket.emit(
        'commentCreate',
        modalContent.comment.left,
        modalContent.comment.top,
        modalContent.comment.className,
        newContent,
        user?._id,
        room?.document?._id,
        room?._id,
        (response: { isSuccess: boolean }) => {
          if (response.isSuccess) {
            setUserMode(UserModes.DEFAULT)
            socket.emit('commentStateSetter', user?._id, room?._id, UserModes.DEFAULT)
          }
        }
      )

      setModalContent({
        mode: 'default',
        comment: {
          _id: modalContent.comment._id,
          content: newContent,
          resolved: modalContent.comment.resolved,
          createdBy: user!._id,
          timesEdited: modalContent.comment.timesEdited + 1,
          left: modalContent.comment.left,
          top: modalContent.comment.top,
          createdAt: modalContent.comment.createdAt,
          className: modalContent.comment.className,
          document: room!.document!._id
        }
      })
    }
    enableDisableEdit(e)
  }

  function enableDisableEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setReadOnly(!readOnly)
    setNewContent(modalContent.comment!.content)
  }

  function resolveComment(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    socket.emit(
      'commentResolve',
      modalContent.comment?._id,
      room?.document?._id,
      room?._id,
      !modalContent.comment?.resolved
    )

    setModalContent({
      mode: 'default',
      comment: {
        _id: modalContent.comment!._id,
        content: newContent,
        resolved: !modalContent.comment?.resolved,
        createdBy: modalContent.comment!.createdBy,
        timesEdited: modalContent.comment!.timesEdited + 1,
        left: modalContent.comment!.left,
        top: modalContent.comment!.top,
        createdAt: modalContent.comment!.createdAt,
        className: modalContent.comment!.className,
        document: room!.document!._id
      }
    })

    closeModal()
  }

  useEffect(() => {
    if (
      modalContent.comment?._id === 'draft' &&
      editButton.current !== null &&
      newContent === '' &&
      modalContent.comment?.content === ''
    ) {
      editButton.current!.click()
      textArea.current?.focus()
    }
  }, [modalContent])

  useEffect(() => {
    if (modalContent.comment) {
      setNewContent(modalContent.comment.content)
    }
  }, [modalContent.comment?.content])

  useEffect(() => {
    if (!modalContent.comment) return

    socket.emit(
      'userFetch',
      modalContent.comment?.createdBy,
      (response: { isSuccess: boolean; user: { name: string; userName: string } }) => {
        setUserFromComment({
          name: response.user.name,
          userName: response.user.userName
        })
      }
    )
  }, [modalContent.comment])

  return (
    <>
      <ModalContainer isOpen={showMobileComment}>
        <Header>
          <CloseButton onClick={() => closeModal()}>
            <X />
          </CloseButton>
          <p>{userFromComment.name}</p>
        </Header>
        <Body>
          <TextArea
            ref={textArea}
            placeholder="Enter your message..."
            onInput={(e) => {
              setNewContent(e.currentTarget.value)
            }}
            autoFocus={readOnly}
            readOnly={readOnly}
            name=""
            id=""
            value={newContent}
          />
          <ButtonWrapper>
            {modalContent.comment?.createdBy === user?._id && (
              <EditButton
                ref={editButton}
                onClick={(e) => {
                  enableDisableEdit(e)
                }}
              >
                {readOnly ? (
                  <div>
                    <Edit size={16} /> <p>Edit Text</p>
                  </div>
                ) : (
                  <div>
                    <X size={16} /> <p>Cancel Editing</p>
                  </div>
                )}
              </EditButton>
            )}
            {modalContent.comment?.createdBy === user?._id && !readOnly && (
              <SaveButton
                disabled={modalContent.comment?.content === newContent}
                onClick={(e) => saveComment(e)}
              >
                Save
              </SaveButton>
            )}
            {readOnly && (
              <ActionButton
                backgroundColor={modalContent.comment?.resolved ? colors.primary : colors.secondary}
                onClick={(e) => resolveComment(e)}
              >
                <CheckCircle size={16} color="white" />{' '}
                {modalContent.comment?.resolved ? 'Unresolve' : 'Resolve'}
              </ActionButton>
            )}
          </ButtonWrapper>
        </Body>
      </ModalContainer>
      <Background isOpen={showMobileComment} onClick={() => closeModal()} />
    </>
  )
}

const TextArea = styled.textarea`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0;
  width: 100%;
  height: 100%;

  background: ${colors.grey[100]};
  border: none;
  resize: none;
  padding: 2rem;

  font-size: 1.6rem;
  line-height: 2.4rem;
  color: ${colors.grey[400]};
`

const ModalContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${colors.white};
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  z-index: 101;

  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(100%)')};
  transition: transform 0.3s ease-in-out;
`

const Padding = styled.div`
  padding: 0 2rem;
`

const Header = styled(Padding)`
  height: 6rem;
  border-bottom: 1px solid ${colors.grey[100]};
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;

  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`

const CloseButton = styled.button`
  background-color: ${colors.white};
  height: 2.4rem;
  width: 2.4rem;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const EditButton = styled.button`
  background: white;
  margin-top: 1rem;
  z-index: 1;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  border: none;
  font-size: 1.6rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.1s ease-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid ${colors.grey[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`

const SaveButton = styled.button<{ disabled: boolean }>`
  background: ${(props) => (props.disabled ? colors.grey[300] : colors.secondary)};
  margin-top: 1rem;
  z-index: 1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  border: none;
  font-size: 1.6rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.1s ease-out;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.18);
`

const ActionButton = styled.button<{ backgroundColor: string }>`
  background: ${(props) => props.backgroundColor};
  margin-top: 1rem;
  z-index: 1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  border: none;
  font-size: 1.6rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.1s ease-out;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.18);


  :hover {
    transform: scale(0.98);
    background: ${(props) =>
      props.backgroundColor === colors.grey[300] ? colors.grey[300] : colors.primary}};
  }

  :active {
    transform: scale(0.96);
  }

  svg {
    margin-right: 0.5rem;
  }
`

const Body = styled(Padding)`
  position: relative;
  overflow: auto;
  height: calc(100vh - 10rem);
  background-color: ${colors.grey[100]};
`

const Background = styled.div<{ isOpen: boolean }>`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
  opacity: ${({ isOpen }) => (isOpen ? '1' : '0')};
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 2rem;
`

export default Modal
