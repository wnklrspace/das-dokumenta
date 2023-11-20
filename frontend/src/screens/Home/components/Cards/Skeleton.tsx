import { Spinner } from '@geist-ui/core'
import { FC } from 'react'
import styled from 'styled-components'
import { colors } from '../../../../theme'

const Skeleton: FC = () => {
  return (
    <Container>
      <Spinner />
    </Container>
  )
}

const Container = styled.div`
  height: 8.5rem;
  background: ${colors.grey[100]};
  border-radius: 16px;

  display: flex;
  justify-content: center;
  align-items: center;
`

export default Skeleton
