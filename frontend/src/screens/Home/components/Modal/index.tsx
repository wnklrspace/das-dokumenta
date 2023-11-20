import { FC, useState } from 'react'
import { useToasts } from '@geist-ui/core'
import UploadModalView from './view'
import { useUser } from '../../../../store/UserProvider'
import { useSocket } from '../../../../store/SocketProvider'
import { ErrorMessages } from '../../../../types/Errors'
import verifyProjectName from './verifyModalInput'

interface Props {
  handleHideModal: () => void
}

const Modal: FC<Props> = ({ handleHideModal }) => {
  const { setToast } = useToasts()
  const { user } = useUser()
  const socket = useSocket()
  const [projectName, setProjectName] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleShowToast = (text: string[], type: 'success' | 'error') =>
    setToast({
      text: (
        <p>
          {text.map((t: string) => {
            return t
          })}
        </p>
      ),
      type: type
    })

  async function handleCreateProject() {
    try {
      setLoading(true)

      if (!user) {
        handleShowToast(['User not found!'], 'error')
        setLoading(false)
        setProjectName('')
        setFile(null)
        return
      }
      if (!file) {
        handleShowToast(['File not found!'], 'error')
        setLoading(false)
        setProjectName('')
        setFile(null)
        return
      }

      const verifyProjectNameResponse = verifyProjectName(projectName)

      if (verifyProjectNameResponse === 'NAME_TOO_LONG') {
        handleShowToast(['Project name is too long!'], 'error')
        setLoading(false)
        setProjectName('')
        setFile(null)
        return
      }

      if (verifyProjectNameResponse === 'NAME_EMPTY') {
        handleShowToast(['Please provide a project name!'], 'error')
        setLoading(false)
        setProjectName('')
        setFile(null)
        return
      }

      socket.emit(
        'documentCreate',
        user._id,
        projectName,
        file,
        (response: { isSuccess: boolean; message: ErrorMessages }) => {
          if (!response.isSuccess) {
            handleShowToast(['Something went wrong creating the project!'], 'error')
            setLoading(false)
          } else {
            handleShowToast(['Project created successfully!'], 'success')
            handleHideModal()
          }
        }
      )

      setLoading(false)
    } catch (error) {
      setLoading(false)
      handleShowToast(['Something went wrong!'], 'error')
      console.log('error = ', error)
    }
  }

  return (
    <UploadModalView
      loading={loading}
      projectNameHandler={{
        projectName,
        setProjectName
      }}
      fileHandler={{
        file,
        setFile
      }}
      handleHideModal={handleHideModal}
      handleCreateProject={handleCreateProject}
    />
  )
}

export default Modal
