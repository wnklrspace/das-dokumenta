import { FC, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { useRoom, useSocket } from '../../../../store/SocketProvider'
import { useUser } from '../../../../store/UserProvider'
import { useScrollContainerRefs } from '../../../../store/DocumentProvider'
import { colors } from '../../../../theme'

const Cursor: FC = () => {
  const cursor = useRef<HTMLDivElement>(null)
  const { pdfWrapperRef, pdfCanvasRef } = useScrollContainerRefs()

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [colleagueCursorProps, setColleagueCursorProps] = useState({
    x: 0,
    y: 0,
    opacity: 0
  })

  const socket = useSocket()
  const { user } = useUser()
  const { room } = useRoom()

  function getCursorCoordinates(event: MouseEvent) {
    const pdfCanvas = pdfCanvasRef.current
    const canvasHitBox = pdfCanvas!.getBoundingClientRect()

    const offsetX = window.scrollX + canvasHitBox.left
    const offsetY = window.scrollY + canvasHitBox.top
    const canvasX = event.clientX - offsetX
    const canvasY = event.clientY - offsetY

    //This divider is being used to eliminate the height/width of the scrollbar in the calculation in case there is one
    const xPercent = (canvasX * 100) / pdfCanvas!.children[0].getBoundingClientRect().width

    //The y value is passed as an absolute number, because further calculation has to be done with it due to scrolling, affecting the cursor's y coordinate
    return {
      xPercent: xPercent,
      yPixels: canvasY,
      canvasHeight: canvasHitBox.height
    }
  }

  useEffect(() => {
    const pdfCanvas = pdfCanvasRef.current

    function handleMouseMove(event: MouseEvent) {
      const x = event.clientX
      const y = event.clientY

      socket.emit('updateCursor', room?._id, user?._id, {
        x: getCursorCoordinates(event).xPercent,
        y:
          ((getCursorCoordinates(event).yPixels + window.scrollY) * 100) /
          getCursorCoordinates(event).canvasHeight,
        opacity: 1
      })

      setCursorPosition({
        x: x,
        y: y
      })

      setColleagueCursorProps({
        x: getCursorCoordinates(event).xPercent,
        y: getCursorCoordinates(event).yPixels,
        opacity: 1
      })
    }

    function addMouseMoveListener(event: MouseEvent) {
      pdfCanvas!.addEventListener('mousemove', handleMouseMove)
      cursor.current!.style.opacity = '1'
      //Make the custom cursor available when your cursor appears to be on the canvas because it has been above the canvas on the previous screen
      setCursorPosition({
        x: event.clientX,
        y: event.clientY
      })
      setColleagueCursorProps({
        x: colleagueCursorProps.x,
        y: colleagueCursorProps.y,
        opacity: 1
      })
    }

    function removeMouseMoveListener() {
      pdfCanvas!.removeEventListener('mousemove', handleMouseMove)
      cursor.current!.style.opacity = '0'
      setColleagueCursorProps({
        x: colleagueCursorProps.x,
        y: colleagueCursorProps.y,
        opacity: 0
      })

      socket.emit('updateCursor', room?._id, user?._id, {
        x: colleagueCursorProps.x,
        y:
          ((colleagueCursorProps.y + window.scrollY) * 100) /
          pdfCanvas!.getBoundingClientRect().height,
        opacity: 0
      })
    }

    pdfCanvas!.addEventListener('mouseenter', addMouseMoveListener)
    pdfCanvas!.addEventListener('mouseleave', removeMouseMoveListener)

    return () => {
      pdfCanvas!.removeEventListener('mouseenter', addMouseMoveListener)
      pdfCanvas!.removeEventListener('mouseleave', removeMouseMoveListener)
    }
  })

  useEffect(() => {
    if (!room || !user) return

    const pdfWrapper = pdfWrapperRef.current!

    const onScroll = (event: any) => {
      socket.emit('updateCursor', room?._id, user?._id, {
        x: colleagueCursorProps.x,
        y:
          ((colleagueCursorProps.y + pdfWrapper.scrollTop) * 100) /
          getCursorCoordinates(event).canvasHeight,
        opacity: 1
      })

      setCursorPosition({
        x: cursorPosition.x,
        y: cursorPosition.y
      })

      setColleagueCursorProps({
        x: colleagueCursorProps.x,
        y: colleagueCursorProps.y,
        opacity: 1
      })

      console.log(((colleagueCursorProps.y + window.scrollY) * 100) /
        getCursorCoordinates(event).canvasHeight)
    }

    pdfWrapperRef.current!.addEventListener('scroll', onScroll)

    return () => pdfWrapper.removeEventListener('scroll', onScroll)
  }, [getCursorCoordinates])

  return (
    <Container
      ref={cursor}
      style={{
        transform: `translate(-4px, -4px)`,
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`
      }}
    >
      <Inner>
        <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_420_1862)">
            <path
              d="M13.8 13.3819L5.59294 13.537L0.00724052 19.6428L0 0.785645L13.8 13.3819Z"
              fill="black"
            />
            <path
              d="M5.31006 13.2694L0.393241 18.644L0.386719 1.6665L12.8116 13.0076L5.58577 13.1442L5.42178 13.1472L5.31006 13.2694Z"
              stroke="white"
            />
            <path
              d="M6.37486 0H6.37484C4.10431 0 2.26367 1.87157 2.26367 4.18027V4.18028C2.26367 6.48898 4.10431 8.36055 6.37484 8.36055H6.37486C8.6454 8.36055 10.486 6.48898 10.486 4.18028V4.18027C10.486 1.87157 8.6454 0 6.37486 0Z"
              fill={colors.secondary}
            />
            <path
              d="M8.941 3.62896V4.7313H6.91738V6.78897H5.83323V4.7313H3.80957V3.62896H5.83323V1.57129H6.91738V3.62896H8.941Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_420_1862">
              <rect width="16" height="20" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </Inner>
    </Container>
  )
}

const Container = styled.div`
  pointer-events: none;
  position: fixed;
  left: -5px;
  top: -5px;
  z-index: 2;
  //Avoid seeing the cursor jump around when leaving and then reentering the document in a different spot than where you left
  transition: opacity 0.002s linear 0.001s;
  opacity: 0;
`

const Inner = styled.div`
  & > svg {
    width: 30px;
    height: 30px;
  }
`

export default Cursor
