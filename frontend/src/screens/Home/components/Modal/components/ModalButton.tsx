import { FC } from 'react'
import styled from 'styled-components'
import Button from '../../../../../components/Button/Button'
import { colors } from '../../../../../theme'

interface Props {
  onClick: () => void
}

const UploadModalButton: FC<Props> = ({ onClick }) => {
  return (
    <ButtonContainer>
      <Button title="Create New Document" onClick={onClick} />
    </ButtonContainer>
  )
}

const ButtonContainer = styled.div`
  width: 100%;
  background-color: ${colors.tertiary[100]};
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
  display: flex;
`
export default UploadModalButton
