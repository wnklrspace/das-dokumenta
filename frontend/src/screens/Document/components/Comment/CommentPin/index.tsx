import styled from 'styled-components'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Spinner } from '@geist-ui/core'
import { colors } from '../../../../../theme'
import { CommentProps } from '../../../../../types'
import { useSocket } from '../../../../../store/SocketProvider'
import {
  CommentRefProps,
  useCommentRefs,
  useScrollContainerRefs,
  useSidebar
} from '../../../../../store/DocumentProvider'

const Comment: FC<CommentProps> = ({ _id, content, createdBy, resolved, left, top, className }) => {
  const [userFromComment, setUserFromComment] = useState<{ name: string; userName: string }>({
    name: '',
    userName: ''
  })
  const socket = useSocket()
  const { setShowResolved } = useSidebar()
  const commentRef = useRef<HTMLDivElement>(null)
  const [readyToScroll, setReadyToScroll] = useState<boolean>(false)
  const { fullCommentRefs, setPinCommentsRefs } = useCommentRefs()
  const { sidebarContainerRef } = useScrollContainerRefs()

  function prepareToScroll(
    _id: string,
    e: React.MouseEvent<HTMLDivElement>,
    resolved: boolean,
    setShowResolved: React.Dispatch<React.SetStateAction<boolean>>,
    setReadyToScroll: React.Dispatch<React.SetStateAction<boolean>>
  ): void {
    //preventing new comments from being created when clicking an existing one
    e.stopPropagation()

    if (resolved) {
      setShowResolved(true)
    } else {
      setShowResolved(false)
    }

    // In order to fill the refs array with the new comment,
    // we need to wait for the next render
    setTimeout(() => {
      setReadyToScroll(true)
    }, 100)
  }

  useEffect(() => {
    if (readyToScroll) {
      const commentRef = fullCommentRefs.find((comment) => comment._id === _id)
      const sidebarContainer = sidebarContainerRef.current

      if (commentRef && sidebarContainer) {
        sidebarContainer.scrollTo({
          top: commentRef.ref.offsetTop - 10,
          behavior: 'smooth'
        })

        commentRef.ref.classList.add('blink')

        setTimeout(() => {
          commentRef.ref.classList.remove('blink')
        }, 1000)
      }
    }

    setReadyToScroll(false)
  }, [readyToScroll])

  useEffect(() => {
    if (commentRef.current) {
      setPinCommentsRefs((prev: CommentRefProps[]) => [
        ...prev,
        {
          _id,
          ref: commentRef.current!
        }
      ])
    }

    return () => {
      setPinCommentsRefs((prev: CommentRefProps[]) => prev.filter((comment) => comment._id !== _id))
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

  return (
    <>
      <CommentPin
        id={`comment-pin-${_id}`}
        ref={commentRef}
        resolved={resolved}
        onClick={(e) => prepareToScroll(_id, e, resolved, setShowResolved, setReadyToScroll)}
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
        <Paragraph className={'small'}>
          {content !== '' ? (
            content
          ) : (
            <ReducedOpacity>please write something descriptive</ReducedOpacity>
          )}
        </Paragraph>
      </CommentPin>
    </>
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

  .whiteSpinner {
    width: 1.6rem !important;
    height: 1.6rem !important;
  }

  .whiteSpinner > .container > span {
    background-color: ${colors.white} !important;
  }
`

const CommentPin = styled.div<{ resolved: boolean }>`
  width: 3rem;
  max-width: 26rem;
  height: 3rem;
  position: absolute;
  display: flex;
  background-color: ${colors.secondary};
  transition: width 0.15s ease-out, height 0.15s ease-out, background-color 0.2s ease-out;
  text-overflow: ellipsis;
  cursor: pointer;
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  &.left {
    transform: translate(0%, -100%);
    border-radius: 2rem 2rem 2rem 0;
  }

  &.right {
    transform: translate(-100%, -100%);
    border-radius: 2rem 2rem 0 2rem;
  }

  ${(props) => props.resolved && `background-color: ${colors.white};`}

  :hover {
    width: 30%;
    height: auto;
    aspect-ratio: unset;
    background-color: white;
    cursor: none;

    border: ${colors.secondary} 3px solid;
    ${(props) => props.resolved && 'border: lightgray 3px solid;'}

    padding: 1rem 1rem 1rem 4rem;
    z-index: 1;
    box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

    p {
      display: block;
      overflow: hidden;
    }

    ${NameBubble} {
      left: 1rem;
      top: 1rem;
    }
  }
`

const Paragraph = styled.p`
  display: none;
  height: 3rem;
  width: fit-content;
  line-height: 1.5rem;
`

const ReducedOpacity = styled(Paragraph)`
  font-size: 12px;
  opacity: 0.25;
`

export default Comment
