import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { List } from '@geist-ui/icons'
import styled from 'styled-components'
import { useSocket, useRoom } from '../../../../store/SocketProvider'
import { useUser } from '../../../../store/UserProvider'
import { UserProps } from '../../../../types'
import { ErrorMessages } from '../../../../types/Errors'
import { useSidebar } from '../../../../store/DocumentProvider'
import { colors } from '../../../../theme'
import AvatarGroup from '../../../../components/Avatar/AvatarGroup'
import useWindowSize from '../../../../hooks/useWindowSize'

const DocumentHeader: FC = () => {
  const navigate = useNavigate()
  const socket = useSocket()
  const { width } = useWindowSize()
  const { user } = useUser()
  const { room } = useRoom()
  const { sidebar, setSidebar } = useSidebar()

  function handleNavigateToHome() {
    if (user && room) {
      socket.emit('roomLeave', (response: { isSuccess: boolean; message: ErrorMessages }) => {
        if (!response.isSuccess) {
          console.log(response.message, 'could not be left')
        } else {
          navigate('/app')
        }
      })
    } else {
      console.log('could not leave room', room, user)
    }
  }

  return (
    <>
      <TitleContainer>
        <Title>{room?.document?.title}</Title>
      </TitleContainer>
      <Container>
        <DocumentHeaderButton onClick={() => handleNavigateToHome()}>
          <ArrowIcon>&lt;</ArrowIcon>Back
        </DocumentHeaderButton>
        <Title>{room?.document?.title}</Title>
        <SidebarProfileWrapper>
          <AvatarGroup
            nameList={room ? room.users.map((user: UserProps) => user.userName.charAt(0)) : []}
          />
          {width > 768 && (
            <DocumentHeaderButton onClick={() => setSidebar(!sidebar)}>
              <List />
            </DocumentHeaderButton>
          )}
        </SidebarProfileWrapper>
      </Container>
    </>
  )
}

const Container = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  gap: 2rem;
  background: ${colors.grey[500]};
  height: 6.4rem;

  h1 {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 1.5rem 2rem;
    h1 {
      display: block;
    }
  }
`
const TitleContainer = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  z-index: 1;
  background: ${colors.grey[500]};
  border-bottom: 1px solid ${colors.grey[300]};
  height: 3.2rem;

  @media (min-width: 768px) {
    display: none;
  }
`

const DocumentHeaderButton = styled.div`
  padding: 0.8rem 1.6rem;
  background-color: ${colors.grey[400]};
  border: 2px solid ${colors.grey[400]};
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
  border-radius: 0.8rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  color: white;
  font-size: 1.4rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s ease-out;
  gap: 0.8rem;

  :hover {
    background-color: ${colors.grey[600]};
    box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
  }
`

const ArrowIcon = styled.span`
  font-size: 1.6rem;
  line-height: 1.25;
  text-decoration: none;
`

const SidebarProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
`

const Title = styled.h1`
  position: absolute;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.6rem;
  font-weight: 400;
  color: ${colors.grey[300]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80%;

  @media (min-width: 768px) {
    width: 30ch;
    font-size: 1.8rem;
  }
`

export default DocumentHeader
