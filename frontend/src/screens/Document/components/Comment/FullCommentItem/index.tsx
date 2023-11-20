import React, { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useToasts } from '@geist-ui/core'
import { Edit, Save, X, CheckCircle } from '@geist-ui/icons'
import { CommentProps, UserModes } from '../../../../../types'
import { ScrollbarPurple } from '../../../../../styles/scrollbars'
import { useUser } from '../../../../../store/UserProvider'
import { colors } from '../../../../../theme'
import {
  CommentRefProps,
  useCommentDraft,
  useCommentRefs,
  useComments,
  useScrollContainerRefs,
  useUserMode
} from '../../../../../store/DocumentProvider'
import { useRoom, useSocket } from '../../../../../store/SocketProvider'

function scrollToCommentPin(
  _id: string,
  e: React.MouseEvent<HTMLDivElement>,
  pinCommentRefs: CommentRefProps[],
  pdfWrapperRef: React.RefObject<HTMLDivElement>
): void {
  //preventing new comments from being created when clicking an existing one
  e.stopPropagation()

  if (pinCommentRefs) {
    const pinComment = pinCommentRefs.find((pin) => _id === pin._id)

    pdfWrapperRef.current!.scrollTo(0, pinComment!.ref.offsetTop - 40)
    pinComment!.ref.classList.add('blink')

    window.setTimeout(() => {
      pinComment!.ref.classList.remove('blink')
    }, 1000)
  }
}

const FullCommentItem: FC<CommentProps> = ({
  _id,
  left,
  top,
  resolved,
  timesEdited,
  className,
  createdBy,
  content
}) => {
  const [readOnly, setReadOnly] = useState(true)
  const [newContent, setNewContent] = useState<string>(content)
  const [userFromComment, setUserFromComment] = useState<{ name: string; userName: string }>({
    name: '',
    userName: ''
  })
  const comment = useRef<HTMLDivElement>(null)
  const textArea = useRef<HTMLTextAreaElement>(null)
  const editButton = useRef<HTMLButtonElement>(null)
  const expandButton = useRef<HTMLButtonElement>(null)
  const socket = useSocket()
  const { user } = useUser()
  const { room } = useRoom()
  const { setUserMode } = useUserMode()
  const { setCommentDraft } = useCommentDraft()
  const { setToast } = useToasts()
  const { pinCommentRefs, setFullCommentRefs } = useCommentRefs()
  const { pdfWrapperRef } = useScrollContainerRefs()
  let textOverflow = false

  const handleShowToast = (text: string[], type: 'success' | 'error') =>
    setToast({
      text: (
        <p>
          {text.map((t: string) => {
            return t
          })}
        </p>
      ),
      type: type
    })

  function enableDisableEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setReadOnly(!readOnly)
    setNewContent(content)
  }

  function updateTextOverflow() {
    textOverflow = textArea.current!.clientHeight < textArea.current!.scrollHeight
  }

  function updateTextBoxHeight() {
    textArea.current!.style.height = 'auto'
    textArea.current!.style.height = `${textArea.current!.scrollHeight}px`

    updateTextOverflow()

    if (textOverflow) {
      expandButton.current!.innerHTML = 'view less...'
      expandButton.current!.classList.remove('hidden')
    } else {
      expandButton.current!.innerHTML = 'view more...'
      expandButton.current!.classList.add('hidden')
    }
  }

  function setButtonText() {
    if (expandButton.current!.innerHTML === 'view more...') {
      textArea.current!.style.height = `${textArea.current!.scrollHeight}px`
      expandButton.current!.innerHTML = 'view less...'
    } else {
      textArea.current!.style.height = 'auto'
      expandButton.current!.innerHTML = 'view more...'
    }
  }

  function resolveComment(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    socket.emit(
      'commentResolve',
      _id,
      room?.document?._id,
      room?._id,
      !resolved,
      (response: { isSuccess: boolean }) => {
        if (response.isSuccess) {
          if (resolved) {
            handleShowToast([`Resolve state was reverted successfully`], 'success')
          } else {
            handleShowToast([`Comment was resolved successfully`], 'success')
          }
        } else {
          handleShowToast([`Comment could not be resolved`], 'error')
        }
      }
    )
  }

  function saveEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (_id === 'draft') {
      socket.emit(
        'commentCreate',
        left,
        top,
        className,
        newContent,
        user?._id,
        room?.document?._id,
        room?._id,
        (response: { isSuccess: boolean }) => {
          if (response.isSuccess) {
            setUserMode(UserModes.DEFAULT)
            socket.emit('commentStateSetter', user?._id, room?._id, UserModes.DEFAULT)
            setCommentDraft(undefined)
          }
        }
      )
      setReadOnly(true)
      enableDisableEdit(e)
    } else {
      socket.emit('commentUpdate', _id, room?.document?._id, room?._id, newContent, timesEdited + 1)
      setReadOnly(true)
      enableDisableEdit(e)
      setNewContent(newContent)
    }
  }

  function handleDisableSaveButton() {
    return content === newContent
  }

  useEffect(() => {
    if (comment.current) {
      setFullCommentRefs((prev: CommentRefProps[]) => [
        ...prev,
        {
          _id,
          ref: comment.current!
        }
      ])
    }

    return () => {
      setFullCommentRefs((prev: CommentRefProps[]) => prev.filter((comment) => comment._id !== _id))
    }
  }, [])

  useEffect(() => {
    const onPageLoad = () => {
      updateTextOverflow()
      if (textOverflow) {
        expandButton.current!.classList.remove('hidden')
      }
      if (content === '' && editButton.current !== null) {
        editButton.current!.click()
      }
    }

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad()
    } else {
      window.addEventListener('load', onPageLoad)
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad)
    }
  }, [])

  useEffect(() => {
    socket.emit(
      'userFetch',
      createdBy,
      (response: { isSuccess: boolean; user: { name: string; userName: string } }) => {
        setUserFromComment({
          name: response.user.name,
          userName: response.user.userName
        })
      }
    )
  }, [])

  useEffect(() => {
    if (textArea.current && textArea.current.value !== content) {
      textArea.current.value = content
    }
  }, [content])

  return (
    <CommentSidebarItem
      ref={comment}
      onClick={(e) => scrollToCommentPin(_id, e, pinCommentRefs, pdfWrapperRef)}
      id={`comment-item-${_id}`}
      className={'comment-item'}
    >
      <EditButtonWrapper>
        <AuthorName>
          {userFromComment.userName} {timesEdited > 0 && <Small>(edited)</Small>}
        </AuthorName>
        {createdBy === user?._id && (
          <EditButton
            ref={editButton}
            onClick={(e) => {
              enableDisableEdit(e)
            }}
          >
            {readOnly ? <Edit size={16} /> : <X size={16} />}
          </EditButton>
        )}
      </EditButtonWrapper>
      <TextArea
        ref={textArea}
        placeholder="Enter your message..."
        autoFocus={content === ''}
        rows={3}
        readOnly={readOnly}
        onInput={(e) => {
          updateTextBoxHeight()
          setNewContent(e.currentTarget.value)
        }}
        value={newContent}
      />
      {
        <ButtonLinkStyle
          ref={expandButton}
          className={'hidden'}
          onClick={(e) => {
            e.stopPropagation()
            setButtonText()
          }}
        >
          view more...
        </ButtonLinkStyle>
      }

      {!readOnly && (
        <ActionButton
          backgroundColor={handleDisableSaveButton() ? colors.grey[300] : colors.secondary}
          disabled={handleDisableSaveButton()}
          onClick={(e) => {
            saveEdit(e)
          }}
        >
          <Save size={16} color="white" /> save
        </ActionButton>
      )}
      {readOnly && (
        <ActionButton
          backgroundColor={resolved ? colors.primary : colors.secondary}
          onClick={(e) => resolveComment(e)}
        >
          <CheckCircle size={16} color="white" /> {resolved ? 'Unresolve' : 'Resolve'}
        </ActionButton>
      )}
    </CommentSidebarItem>
  )
}

const CommentSidebarItem = styled.div`
  width: 100%;
  border-radius: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  box-shadow: 0 4px 6px 2px rgba(0, 0, 0, 0.1);
  border: 2px solid ${colors.grey[200]};
  transition: all 0.15s ease-out;

  :hover {
    border: 2px solid ${colors.grey[300]};
    transform: scale(1.02);
    box-shadow: 0 4px 10px 2px rgba(0, 0, 0, 0.1);
  }

  ${ScrollbarPurple}

  :focus-within {
    transform: scale(1.02);
    border: 2px solid ${colors.grey[300]};
    box-shadow: 0 4px 10px 2px rgba(0, 0, 0, 0.1);
  }
`

const Small = styled.span`
  font-size: 1rem;
  opacity: 0.5;
`

const TextArea = styled.textarea`
  width: 100%;
  max-height: 60vh;
  resize: none;
  border-radius: 0.5rem;
  border-color: ${colors.grey[200]};
  margin-top: 1rem;
  padding: 0.5rem;
  font-size: 1.4rem;
  color: ${colors.grey[400]};
`

const AuthorName = styled.p`
  color: ${colors.grey[400]};
  font-weight: 500;
  font-size: 1.6rem;
  white-space: nowrap;

  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const ButtonLinkStyle = styled.button`
  width: auto;
  background: none;
  color: ${colors.grey[400]};
  border: none;
  padding: 0.5rem 0;
  text-align: left;
  font-size: 1.2rem;
  cursor: pointer;
  font-weight: 400;
`

const ActionButton = styled.button<{ backgroundColor: string }>`
  background: ${(props) => props.backgroundColor};
  margin-top: 1rem;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  border: none;
  font-size: 1.6rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.1s ease-out;
  box-shadow: 0 4px 8px rgba(101, 16, 186, 0.32);
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  white-space: nowrap;

  :hover {
    transform: scale(0.98);
    background: ${(props) =>
      props.backgroundColor === colors.grey[300] ? colors.grey[300] : colors.primary}};
    box-shadow: 0 4px 16px rgba(101, 16, 186, 0.32);
  }

  :active {
    transform: scale(0.96);
  }

  svg {
    margin-right: 0.5rem;
  }
`

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const EditButton = styled.button`
    padding: 0.5rem 1rem;
    border-radius: 5rem;
    border: none;
    font-size: 1.6rem;
    margin-left: 1rem;
    font-weight: 400;
    width: fit-content;
    display: flex;
    align-items: center;
    background: none;
    color: grey;
    transition: all 0.1s ease-out;
    cursor: pointer;

    :hover {
        color: black;
`

export default FullCommentItem
