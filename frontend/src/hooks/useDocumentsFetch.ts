import { useMemo } from 'react'
import { DocumentProps } from 'react-pdf'

const useDocumentsFetch = ({
  socket,
  showModal,
  setDocuments
}: {
  socket: any
  showModal: boolean
  setDocuments: any
}) => {
  useMemo(() => {
    socket.emit('documentsFetch')
    socket.on('availableDocuments', (data: DocumentProps[]) => {
      setDocuments(data)
    })

    return () => {
      socket.off('availableDocuments')
    }
  }, [socket, showModal])
}

export default useDocumentsFetch
