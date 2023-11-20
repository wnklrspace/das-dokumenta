import { FC } from 'react'
import styled from 'styled-components'
import { useUser } from '../../../../store/UserProvider'
import { colors } from '../../../../theme'

const Hero: FC = () => {
  const { user } = useUser()

  return (
    <Container>
      <Title>Hi {user ? user.userName : 'No User selected'}!</Title>
      <Paragraph>New comments are waiting for you.</Paragraph>
    </Container>
  )
}

const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${colors.black};
  margin-bottom: 10px;
`

const Paragraph = styled.p`
  font-size: 1.6rem;
  font-weight: 400;
  color: ${colors.black};
`

const Container = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
  padding: 0 10px;
`
export default Hero
