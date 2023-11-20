import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Spinner } from '@geist-ui/core'
import { CommentProps } from '../../../../../types'
import { useModal } from '../../../../../store/ModalProvider'
import { useSocket } from '../../../../../store/SocketProvider'
import { colors } from '../../../../../theme'
import useWindowSize from '../../../../../hooks/useWindowSize'

const MobileComment: FC<CommentProps> = ({
  _id,
  content,
  createdBy,
  resolved,
  timesEdited,
  left,
  top,
  className,
  createdAt,
  document
}) => {
  const [userFromComment, setUserFromComment] = useState<{ name: string; userName: string }>({
    name: '',
    userName: ''
  })
  const socket = useSocket()
  const { width } = useWindowSize()
  const { setShowMobileComment, setModalContent } = useModal()

  function handleSetMobileComment(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.stopPropagation()

    setShowMobileComment(true)
    setModalContent({
      mode: 'edit',
      comment: {
        _id,
        content,
        resolved,
        createdBy,
        timesEdited,
        left,
        top,
        createdAt,
        className,
        document
      }
    })
  }

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

  return (
    <Container
      id={`mobile-comment-pin-${_id}`}
      resolved={resolved}
      onClick={(e) => handleSetMobileComment(e)}
      className={`comment-pin ${className}`}
      style={{
        top: `${top}%`,
        left: `${left}%`
      }}
    >
      <NameBubble>
        {userFromComment.userName !== '' ? (
          userFromComment.userName.charAt(0)
        ) : (
          <Spinner className="whiteSpinner" />
        )}
      </NameBubble>
      <Paragraph className={'small'}>{content}</Paragraph>
      {width < 768 && _id === 'draft' && <PulsatingCircle />}
    </Container>
  )
}

const NameBubble = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${colors.primary};
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Container = styled.div<{ resolved: boolean }>`
  width: 3rem;
  height: 3rem;
  position: absolute;
  display: flex;
  border-radius: 100%;
  background-color: ${colors.secondary};
  transition: width 0.15s ease-out, height 0.15s ease-out, background-color 0.2s ease-out;
  text-overflow: ellipsis;
  cursor: pointer;
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  z-index: 100;

  &.left {
    transform: translate(0%, -100%);
    border-radius: 2rem 2rem 2rem 0;
  }

  &.right {
    transform: translate(-100%, -100%);
    border-radius: 2rem 2rem 0 2rem;
  }

  ${(props) => props.resolved && `background-color: ${colors.grey[100]}`}
`

const Paragraph = styled.p`
  display: none;
  height: 3rem;
  width: fit-content;
  line-height: 1.5rem;
  margin: 0;
  padding: 0;
`

const PulsatingCircle = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${colors.white};
  animation: pulsate 2s ease-out;
  animation-iteration-count: infinite;
  opacity: 0;
  box-shadow: 0 0 0 0 ${colors.white};
  transform: translate(-50%, -50%);
  z-index: 1;

  @keyframes pulsate {
    0% {
      transform: translate(-50%, -50%) scale(0.1, 0.1);
      opacity: 0;
      box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
    }
    50% {
      opacity: 0.4;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.2, 1.2);
      opacity: 0;
      box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
    }
  }
`

export default MobileComment
