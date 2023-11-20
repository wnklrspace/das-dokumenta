import React, { FC } from 'react'
import SocketProvider from './store/SocketProvider'

interface Props {
  children: React.ReactNode
}

const ProtectedScreen: FC<Props> = ({ children }) => {
  return <SocketProvider>{children}</SocketProvider>
}

export default ProtectedScreen
