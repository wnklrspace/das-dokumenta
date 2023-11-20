import { FC } from 'react'
import styled from 'styled-components'
import { colors } from '../../theme'

interface Props {
  name: string
}

const Avatar: FC<Props> = ({ name }) => {
  return <Container>{name}</Container>
}

const Container = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${colors.secondary};
  border: 2px solid ${colors.white};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-left: -8px;

  @media (min-width: 1024px) {
    font-size: 1.2rem;
    width: 3.5rem;
    height: 3.5rem;
  }
`

export default Avatar
