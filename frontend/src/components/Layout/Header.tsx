import { FC } from 'react'
import Logo from '../Logo/Logo'
import styled from 'styled-components'
import LogoutButton from './LogoutButton'

const Header: FC = () => {
  const href = window.location.href

  return (
    <Container>
      <Inner>
        <Logo />
      </Inner>
      {!href.includes('/login') && <LogoutButton />}
    </Container>
  )
}

const Container = styled.div`
  min-height: 80px;
  padding: 0 4rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Inner = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media screen and (min-width: 1024px) {
    justify-content: flex-start;
  }
`

export default Header
