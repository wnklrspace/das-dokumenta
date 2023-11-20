import { FC } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import LogOut from '@geist-ui/icons/logOut'
import { useStatus, useToken, useUser } from '../../store/UserProvider'

const LogoutButton: FC = () => {
  const navigate = useNavigate()
  const { setUser } = useUser()
  const { setToken } = useToken()
  const { setIsLoggedIn } = useStatus()

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('isLoggedIn')
    setUser(undefined)
    setToken(undefined)
    setIsLoggedIn(false)
    navigate('/login')
  }

  return (
    <Container onClick={() => handleLogout()}>
      <LogOut size={20} color="#333" />
    </Container>
  )
}

const Container = styled.button`
  height: 40px;
  width: 40px;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  border: none;
  background: none;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
`

export default LogoutButton
