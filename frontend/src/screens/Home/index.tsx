import { FC, useState } from 'react'
import styled from 'styled-components'
import { useToasts } from '@geist-ui/core'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { Container } from './components/Cards/styles/ContainerStyled'
import { useSocket, useSocketConnection } from '../../store/SocketProvider'

import { DocumentProps } from '../../types'
import DocumentCardList from './components/Cards/DocumentCardList'
import UploadModal from './components/Modal/'
import UploadModalButton from './components/Modal/components/ModalButton'
import Hero from './components/Hero'
import useRoomFeedback from '../../hooks/useRoomFeedback'
import useDocumentsFetch from '../../hooks/useDocumentsFetch'
import useDocumentUpdated from '../../hooks/useDocumentUpdated'
import LoadingScreen from '../Loading'

const Home: FC = () => {
  const { setToast } = useToasts()
  const socket = useSocket()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [documents, setDocuments] = useState<DocumentProps[]>([])

  const handleShowToast = (text: string[]) =>
    setToast({
      text: (
        <p>
          {text.map((t: string) => {
            return t
          })}
        </p>
      ),
      type: 'error'
    })

  useRoomFeedback({ socket, navigate, handleShowToast })
  useDocumentsFetch({ socket, showModal, setDocuments })
  useDocumentUpdated({ socket, setDocuments })

  return (
    <Layout>
      <Wrapper>
        <Container>
          <Hero />
        </Container>
        <Container>
          <UploadModalButton onClick={() => setShowModal(true)} />
        </Container>
        <Container>
          <DocumentCardList documents={documents} />
        </Container>
        {showModal && <UploadModal handleHideModal={() => setShowModal(false)} />}
      </Wrapper>
    </Layout>
  )
}

const HomeScreen: FC = () => {
  const socketIsConnected = useSocketConnection()

  return <>{socketIsConnected ? <Home /> : <LoadingScreen backgroundColor="white" />}</>
}

const Wrapper = styled.div`
  padding-bottom: 40px;
`

export default HomeScreen
