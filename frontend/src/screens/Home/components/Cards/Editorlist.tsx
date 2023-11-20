import styled from 'styled-components'
import { EditorIcon } from './styles/EditorIconStyled'
import { FC } from 'react'
import { colors } from '../../../../theme'

interface Props {
  activeUsers: { name: string }[]
  unresolvedComments: number
}

const EditorList: FC<Props> = ({ activeUsers, unresolvedComments }) => {
  return (
    <EditorListWrapper>
      <EditorIconsWrapper>
        {activeUsers && activeUsers.length > 0 ? (
          activeUsers.map((user, index) => {
            if (index < 2) {
              return (
                <EditorIcon key={user.name + index} color={colors.complementary}>
                  <span className="initial">{user.name.charAt(0)}</span>
                </EditorIcon>
              )
            } else if (index === 2) {
              return (
                <EditorIcon key={user.name + index} color={colors.complementary}>
                  <span className="initial">+{activeUsers.length - 2}</span>
                </EditorIcon>
              )
            }
          })
        ) : (
          <EditorIcon color={colors.grey[200]}>
            <span className="initial">0</span>
          </EditorIcon>
        )}
      </EditorIconsWrapper>
      {unresolvedComments > 0 && (
        <UpdateMeta>
          {unresolvedComments} {unresolvedComments === 1 ? 'comment' : 'comments'}
        </UpdateMeta>
      )}
    </EditorListWrapper>
  )
}

const EditorIconsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-left: 8px;
`

const UpdateMeta = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 30px;
  padding: 6px 16px;
  background: ${colors.grey[100]};
  color: ${colors.grey[500]};
  font-size: 12px;
`

const EditorListWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  height: 3rem;
`

export default EditorList
