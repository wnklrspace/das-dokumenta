import React, { FC } from 'react'
import styled from 'styled-components'
import { colors } from '../../../../../theme'

interface Props {
  uploadedFile: {
    name: string
    size: number
  }
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const FileUpload: FC<Props> = ({ uploadedFile, onChange }) => {
  return (
    <Input>
      <HideInput type="file" accept="application/pdf" onChange={onChange} />
      {uploadedFile.size !== 0 ? `${uploadedFile.name}` : 'Upload File'}
    </Input>
  )
}

const Input = styled.label`
  background: ${colors.grey[100]};
  height: 50px;
  margin: 20px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0.2rem dashed ${colors.tertiary[200]};
  border-radius: 0.8rem;
  font-size: 1.6rem;
  cursor: pointer;
`

const HideInput = styled.input`
  display: none;
`

export default FileUpload
