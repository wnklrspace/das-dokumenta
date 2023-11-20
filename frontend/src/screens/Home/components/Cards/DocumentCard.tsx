import { FC } from 'react'
import styled from 'styled-components'
import EditorList from './Editorlist'
import { DocumentProps } from '../../../../types'
import { colors } from '../../../../theme'

interface Props {
  handleOpenDocument: () => void
  activeUsers: { name: string }[]
  unresolvedComments: number
}

const DocumentCard: FC<DocumentProps & Props> = ({
  title,
  comments,
  handleOpenDocument,
  activeUsers
}) => {
  return (
    <CardLink onClick={handleOpenDocument}>
      <CardWrapper>
        <TitleWrapper>
          <h3>{title}</h3>
        </TitleWrapper>

        <EditorList activeUsers={activeUsers} unresolvedComments={comments.length} />
      </CardWrapper>
    </CardLink>
  )
}

const CardWrapper = styled.div`
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 2.4rem;
  gap: 1.8rem;

  max-width: 100%;
  height: auto;

  background: ${colors.white};
  /* Drop Shadow medium light */

  box-shadow: 0 4px 17px rgba(0, 0, 0, 0.08);
  border-radius: 16px;

  :hover {
    box-shadow: 0 4px 17px rgba(0, 0, 0, 0.15);
    transform: scale(1.03);
  }

  h3 {
    font-size: 1.6rem;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  p {
    font-size: 1.2rem;
    color: ${colors.grey[500]};
  }
`

const TitleWrapper = styled.div`
  display: flex;
  max-width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`

const CardLink = styled.div`
  text-decoration: none;
  color: black;
  cursor: pointer;
`

export default DocumentCard
