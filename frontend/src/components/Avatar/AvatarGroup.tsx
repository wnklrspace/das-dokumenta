import { FC } from 'react'
import styled from 'styled-components'
import Avatar from '.'

interface Props {
  nameList: string[]
}

const AvatarGroup: FC<Props> = ({ nameList }) => {
  return (
    <Container>
      {nameList.map((name, index) => {
        if (index < 2) {
          return <Avatar key={index} name={name} />
        } else if (index === 2) {
          return <Avatar key={index} name={'+' + (nameList.length - 2)} />
        }
      })}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: flex-start;
`

export default AvatarGroup
