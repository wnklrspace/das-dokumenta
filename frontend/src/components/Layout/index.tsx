import React, { FC } from 'react'
import styled from 'styled-components'
import Header from './Header'
import Footer from './Footer'

const Main = styled.main`
  position: relative;
  min-height: calc(100vh - 8rem - 6rem);
`

interface Props {
  children: React.ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </>
  )
}

export default Layout
