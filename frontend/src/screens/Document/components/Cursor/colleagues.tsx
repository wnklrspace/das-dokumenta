import { FC } from 'react'
import styled from 'styled-components'
import { Loading } from '@geist-ui/core'
import { UserModes } from '../../../../types'
import { colors } from '../../../../theme'

interface Props {
  x: number
  y: number
  name: string
  opacity: number
  mode: UserModes
}

const ColleaguesCursor: FC<Props> = ({ name, x, y, opacity, mode }) => {
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(-5px, -5px)`,
        left: `${x}%`,
        top: `${y}%`,
        opacity: `${opacity}`,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <Dot />
      <UserName>
        <Name>{name}</Name>
        {mode !== UserModes.DEFAULT && (
          <LoadingBubble>
            <Loading />
          </LoadingBubble>
        )}
      </UserName>
    </div>
  )
}

const LoadingBubble = styled.div`
  position: absolute;
  top: -1.6rem;
  right: -1.6rem;
  width: 3.2rem;
  height: 1.8rem;
  border-radius: 1rem;
  background-color: ${colors.grey[100]};
  border: 1px solid ${colors.grey[200]};
  box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);

  i {
    height: 0.5rem !important;
    width: 0.5rem !important;
  }
`

const Dot = styled.div`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: orange;
`

const UserName = styled.div`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: orange;
  padding: 2px 6px;
  border-radius: 20px;
`

const Name = styled.p`
  font-size: 12px;
  color: white;
`

export default ColleaguesCursor
