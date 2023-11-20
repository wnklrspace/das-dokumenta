import { FC, useEffect, useState } from 'react'
import PDFViewer from '../PDFViewer'
import styled from 'styled-components'
import Cursor from '../Cursor'
import ColleaguesCursor from '../Cursor/colleagues'
import { useRoom, useSocket } from '../../../../store/SocketProvider'
import { useScrollContainerRefs } from '../../../../store/DocumentProvider'
import { UserProps } from '../../../../types'
import useWindowSize from '../../../../hooks/useWindowSize'

const PDFWrapper: FC = () => {
  const [colleagues, setColleagues] = useState<UserProps[] | null>(null)
  const { pdfWrapperRef } = useScrollContainerRefs()
  const { width } = useWindowSize()
  const { room } = useRoom()
  const socket = useSocket()

  useEffect(() => {
    if (room && room.users.length > 0) {
      setColleagues(room.users)
    }
  }, [room])

  return (
    <Container ref={pdfWrapperRef}>
      <Wrapper id={'new-container'}>
        {width > 768 && <Cursor />}
        {colleagues &&
          colleagues.map((colleague: UserProps, index: number) => {
            if (colleague.socketId !== socket.id) {
              return (
                <ColleaguesCursor
                  key={colleague._id + index}
                  name={colleague.userName}
                  x={colleague.cursorProps.x}
                  y={colleague.cursorProps.y}
                  opacity={colleague.cursorProps.opacity}
                  mode={colleague.mode}
                />
              )
            }
            return false
          })}
        <PDFViewer />
      </Wrapper>
    </Container>
  )
}

const Container = styled.div`
  padding: 2rem;
  display: flex;
  justify-items: center;
  position: relative;
  height: calc(100vh - 6.4rem);
  overflow-y: scroll;
  scroll-behavior: smooth;
`

const Wrapper = styled.div`
  margin: auto;
  position: relative;
`

export default PDFWrapper
