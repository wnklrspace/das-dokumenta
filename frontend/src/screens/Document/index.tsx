import { FC, useState } from 'react'
import styled from 'styled-components'
import { useNavigate, useParams } from 'react-router-dom'
import { colors } from '../../theme'
import { useRoom, useSocket, useSocketConnection } from '../../store/SocketProvider'
import { useUser } from '../../store/UserProvider'
import { ScrollbarPurple } from '../../styles/scrollbars'
import { useApplicationReload } from '../../hooks/useApplicationReload'
import DocumentHeader from './components/DocumentHeader'
import PDFWrapper from './components/PDFWrapper'
import DocumentProvider from '../../store/DocumentProvider'
import Sidebar from './components/Sidebar'
import useWindowSize from '../../hooks/useWindowSize'
import Modal from './components/Comment/MobileComment/Modal'
import ModalProvider from '../../store/ModalProvider'
import LoadingScreen from '../Loading'

const Document: FC = () => {
  const socket = useSocket()
  let navigate = useNavigate()
  const { width } = useWindowSize()
  const { slug } = useParams<{ slug: string }>()
  const { user, setUser } = useUser()
  const { room, setRoom } = useRoom()
  const [roomWasUpdated, setRoomWasUpdated] = useState<boolean>(false)

  const href = window.location.href

  // Hook for handling reload of application
  // to prevent user from being kicked out of the room
  useApplicationReload({
    socket,
    slug,
    href,
    user,
    setUser,
    room,
    setRoom,
    roomWasUpdated,
    setRoomWasUpdated,
    navigate
  })

  return (
    <DocumentProvider>
      <ModalProvider>
        <Container>
          <DocumentHeader />
          <Wrapper>
            <PDFWrapper />
            {width > 768 && <Sidebar />}
            {width <= 768 && <Modal />}
          </Wrapper>
        </Container>
      </ModalProvider>
    </DocumentProvider>
  )
}

const DocumentScreen: FC = () => {
  const socketIsConnected = useSocketConnection()

  return <>{socketIsConnected ? <Document /> : <LoadingScreen backgroundColor="gray" />}</>
}

const Container = styled.div`
  background-color: ${colors.grey[100]};
  min-height: 100vh;
`

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr max-content;
  grid-template-rows: 1fr;
  position: relative;
  bottom: 0;
  left: 0;
  height: calc(100% - 6.4rem);
  ${ScrollbarPurple}
`

export default DocumentScreen
