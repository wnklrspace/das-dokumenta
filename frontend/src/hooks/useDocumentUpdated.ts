import { useMemo } from 'react'
import { DocumentProps } from '../types'
import { Socket } from 'socket.io-client'

const useDocumentUpdated = ({ socket, setDocuments }: { socket: Socket; setDocuments: any }) => {
  useMemo(() => {
    socket.on('documentCreated', (document: DocumentProps) => {
      setDocuments((documents: DocumentProps[]) => [...documents, document])
    })

    return () => {
      socket.off('documentCreated')
    }
  }, [])
}

export default useDocumentUpdated
