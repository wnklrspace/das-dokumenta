import React, { FC } from 'react'
import styled from 'styled-components'
import FileUpload from './components/FileUpload'
import Button from '../../../../components/Button/Button'
import InputField from '../../../../components/InputField'
import { colors } from '../../../../theme'

interface Props {
  loading: boolean
  projectNameHandler: {
    projectName: string
    setProjectName: (projectName: string) => void
  }
  fileHandler: {
    file: File | null
    setFile: (file: File) => void
  }
  handleHideModal: () => void
  handleCreateProject: () => void
}

const UploadModalView: FC<Props> = ({
  loading,
  projectNameHandler,
  fileHandler,
  handleHideModal,
  handleCreateProject
}) => {
  const { setProjectName } = projectNameHandler
  const { file, setFile } = fileHandler

  const handleSetProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value)
  }

  const handleSetFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  return (
    <>
      <ModalContainer>
        <h1>Upload your Document and start collaborating!</h1>
        <ModalContent>
          <InputField type="name" label="Document-Title" onChange={handleSetProjectName} />
          <FileUpload
            uploadedFile={{
              name: file?.name || '',
              size: file?.size || 0
            }}
            onChange={handleSetFile}
          />
          <Button
            title={loading ? 'uploading file ...' : `Create New Project`}
            onClick={handleCreateProject}
          />
          <HomeButton onClick={handleHideModal}>Back to homescreen</HomeButton>
        </ModalContent>
      </ModalContainer>
      <ModalBackground onClick={handleHideModal} />
    </>
  )
}

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1;
`

const ModalContainer = styled.div`
  h1 {
    padding-bottom: 2em;
  }

  text-align: center;
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  padding: 5rem;
  height: 80%;
  margin: 0 auto;
  width: 100%;
  background-color: ${colors.white};
  border-radius: 2rem 2rem 0 0;
  bottom: 0;
  z-index: 2;

  @media (min-width: 1024px) {
    padding: 30rem 5rem;
    max-width: 800px;
    height: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 2rem;
  }
`

const ModalContent = styled.div`
  input {
    margin-top: 2rem;
    margin-bottom: 0;
    background: ${colors.grey[100]};
  }

  button {
    width: 100%;
  }

  width: 100%;
  @media (min-width: 1024px) {
    width: 400px;
    margin: 0 auto;
  }
`

const HomeButton = styled.p`
  font-weight: 500;
  text-decoration-line: underline;
  color: ${colors.grey[300]};
  margin-top: 4rem;
  cursor: pointer;
`

export default UploadModalView
