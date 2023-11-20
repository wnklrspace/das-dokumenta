import { Spinner } from '@geist-ui/core'
import { FC } from 'react'
import styled from 'styled-components'

interface Props {
  backgroundColor: 'white' | 'gray'
}

const LoadingScreen: FC<Props> = ({ backgroundColor }) => {
  return (
    <Container backgroundColor={backgroundColor}>
      <LoadingContainer>
        <Spinner />
        <p>Processing Data ...</p>
      </LoadingContainer>
    </Container>
  )
}

const Container = styled.div<{ backgroundColor: 'white' | 'gray' }>`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  background: ${({ backgroundColor }) => (backgroundColor === 'white' ? '#ffffff' : '#ebebeb')}};
`

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

export default LoadingScreen
